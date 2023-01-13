import { LandmarkAggregate } from "components/gestures/Gesture"
import { ActionType } from "components/utils/utilsTS"
export interface ActivatorOptions<T> {
  selector: Selector<T>
  activation: ClassifierActivation<T>
  deactivation: ClassifierActivation<T>
  time: number
  name: string
  maxMistakes?: number
}
export interface ActionOptions<T> {
  name: string
  callback: ClassifierCallback<T>
  onActivate?: ClassifierCallback<T>
  onDeactivate?: ClassifierCallback<T>
}

export interface ClassifierCallback<T> { (data: T, landmarks?: LandmarkAggregate): any }
export interface ClassifierActivation<T> { (data: T, landmarks?: LandmarkAggregate): boolean }
export interface Selector<T> { (landmarks: LandmarkAggregate): T | undefined }

export class Classifier {
  private activators: { [key: string]: GestureActivator<any> }
  private actions: { [key: string]: GestureAction<any> }
  private mapping: { [activatorKey: string]: string }
  public isRunning: boolean = false

  constructor({ activators, actions }: { activators?: GestureActivator<any>[], actions: GestureAction<any>[] }) {
    this.activators = activators?.reduce((a, v) => ({ ...a, [v.name]: v }), {}) || {}
    this.actions = actions?.reduce((a, v) => ({ ...a, [v.name]: v }), {}) || {}
    this.mapping = {}
  }

  classify(landmarks: LandmarkAggregate) {
    Object.entries(this.mapping).forEach(
      ([key, value]) => this.activators[key].classify(landmarks)
        .then(it => {
          this.actions[value].do(it)
        }))
  }

  start() {
    Object.values(this.activators).forEach(it => it.start())
    this.isRunning = true
  }

  reset() {
    Object.values(this.activators).forEach(it => it.reset())
  }

  stop() {
    Object.values(this.activators).forEach(it => it.stop())
    this.isRunning = false
  }

  mapGesture(newMappings: { [activatorKey: string]: string }) {
    if (Object.keys(newMappings).some(key => this.activators[key] === undefined || this.activators[key] === null)) {
      throw "some activators are not defined"
    }

    if (Object.values(newMappings).some(key => this.actions[key] === undefined || this.actions[key] === null)) {
      throw "some actions are not defined"
    }

    // remove mappings based on values as well (mapping has to be one-to-one)
    for (var key in Object.values(newMappings)) {
      if (this.actions.hasOwnProperty(key)) {
        delete this.actions[key]
      }
    }

    this.mapping = {
      ...this.mapping,
      ...newMappings
    }
  }

  updateActivators(activators: { [key: string]: GestureActivator<any> }) {
    this.activators = {
      ...this.activators,
      ...activators
    }
  }

  updateActions(actions: { [key: string]: GestureAction<any> }) {
    this.actions = {
      ...this.actions,
      ...actions
    }
  }

  clearActivators() {
    this.activators = {}
  }

  clearActions() {
    this.actions = {}
  }

  clearMapping() {
    this.mapping = {}
  }

  getActivator(key: string) {
    return this.activators[key]
  }

  getAction(key: string) {
    return this.actions[key]
  }
}

export class GestureActivator<T> {
  readonly name: string
  private running: boolean = false
  private active?: number
  private mistakes: number = 0
  private readonly maxMistakes?: number
  private readonly selector: Selector<T>
  private readonly activation: ClassifierActivation<T>
  private readonly deactivation: ClassifierActivation<T>
  private readonly time: number

  constructor(activatorOptions: ActivatorOptions<T>) {
    this.selector = activatorOptions.selector
    this.activation = activatorOptions.activation
    this.deactivation = activatorOptions.deactivation
    this.time = activatorOptions.time
    this.name = activatorOptions.name
    this.maxMistakes = activatorOptions.maxMistakes
  }

  async classify(landmarks: LandmarkAggregate): Promise<{
    data?: T,
    landmarks?: LandmarkAggregate,
    actionType: ActionType
  }> {
    if (!this.running) return { actionType: ActionType.NOACTION }
    let value: T | undefined
    try {
      value = this.selector(landmarks)
    } catch (error) {
      // value not found
      if (this.checkMistakes() && this.active) {
        console.debug(`${this.name} not found`)
        this.stop()
      }
      return { actionType: ActionType.NOACTION }
    }

    if (value !== null && value !== undefined) {
      if (!this.active && this.activation(value, landmarks)) {
        console.debug(`${this.name} entered`)
        this.active = Date.now()
        this.mistakes = 0
        // call execute if time is set to 0
        return { actionType: this.time === 0 ? ActionType.EXECUTE : ActionType.ACTIVATE, data: value, landmarks }
      } else if (this.active && this.deactivation(value, landmarks)) {
        if (this.checkMistakes()) {
          console.debug(`${this.name} exited`)
          this.active = undefined
          if (value !== null && value !== undefined) {
            return { actionType: ActionType.DEACTIVATE, data: value, landmarks }
          }
        }
      }

      // Do not check for timeout when time is set to 0
      if (this.time !== 0 && this.active && Date.now() - this.active > this.time) {
        console.debug(`${this.name} activated`)
        this.reset()
        return { actionType: ActionType.EXECUTE, data: value, landmarks }
      }
      return { actionType: ActionType.NOACTION }
    }

    if (this.checkMistakes()) {
      console.debug(`${this.name} not found`)
      if (this.active) this.reset()
    }

    return { actionType: ActionType.NOACTION }
  }

  private checkMistakes() {
    if (this.maxMistakes !== undefined && this.mistakes >= this.maxMistakes) {
      return true
    }
    this.mistakes++
    return false
  }

  reset(): void {
    console.debug(`${this.name} reset`)
    this.active = undefined
  }

  start(): void {
    console.debug(`${this.name} started`)
    this.running = true
  }

  stop(): void {
    console.debug(`${this.name} stopped`)
    this.running = false
    this.active = undefined
  }
}

export class GestureAction<T> {
  name: string
  private readonly callback: ClassifierCallback<T>
  private readonly onActivate?: ClassifierCallback<T>
  private readonly onDeactivate?: ClassifierCallback<T>

  constructor(classifierOptions: ActionOptions<T>) {
    this.onActivate = classifierOptions.onActivate
    this.onDeactivate = classifierOptions.onDeactivate
    this.callback = classifierOptions.callback
    this.name = classifierOptions.name
  }

  do({ actionType, data, landmarks }: { actionType: ActionType, data?: T, landmarks?: LandmarkAggregate }): void {
    switch (actionType) {
      case ActionType.NOACTION:
        return
      case ActionType.ACTIVATE:
        if (data !== null && data !== undefined)
          this.activate(data, landmarks)
        return
      case ActionType.DEACTIVATE:
        if (data !== null && data !== undefined) {
          this.deactivate(data, landmarks)
        }
        return
      case ActionType.EXECUTE:
        if (data !== null && data !== undefined)
          this.execute(data, landmarks)
        return
      default:
        return
    }
  }

  activate(data: T, landmarks?: LandmarkAggregate): void {
    this.onActivate?.(data, landmarks)
  }

  deactivate(data: T, landmarks?: LandmarkAggregate): void {
    this.onDeactivate?.(data, landmarks)
  }

  execute(data: T, landmarks?: LandmarkAggregate): void {
    this.callback?.(data, landmarks)
  }
}