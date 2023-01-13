import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { flatten2 } from 'components/utils/utilsTS'
import { COLOR_NAMES, FRAMERATE, WINDOW_SIZE } from 'constants/AppConstants'

export interface PosePoint {
  name: string
  color: string
  data: {
    time: number
    value: number
  }[]
}

export interface PoseData {
  [name: string]: PosePoint
}

export interface VisualiserState {
  value: PoseData
}

const initialState: VisualiserState = {
  value: {},
}

export const visualiserSlice = createSlice({
  name: 'visualiser',
  initialState,
  reducers: {
    updatePoseData: (state, action: PayloadAction<{ poseData: any, prefix: string, time: number }>) => {
      Object.entries(flatten2(action.payload['poseData']))
        .forEach(([key, value]) => {

          const name = action.payload['prefix'] + key
          const newData = { time: action.payload['time'], value: value } as { time: number, value: number }

          if (!(name in state.value)) {
            state.value[name] = { name: name, color: COLOR_NAMES[Object.entries(state.value).length % COLOR_NAMES.length], data: [] }
          }

          if (state.value[name].data.length > WINDOW_SIZE * FRAMERATE) {
            state.value[name].data = state.value[name].data.slice(state.value[name].data.length - WINDOW_SIZE * FRAMERATE + 2)
          }

          state.value[name].data.push(newData)
        })
    },
  },
})

// Action creators are generated for each case reducer function
export const { updatePoseData } = visualiserSlice.actions

export default visualiserSlice.reducer