import { Typography } from "@mui/material"
import { NextButton } from "components/atoms/NextButton"
import { CenterPage } from "components/molecules/CenterCard"
import { FormEventHandler, useState } from 'react'
import { useAppSelector } from "store/hooks"
import { RootState } from "store/store"

const LineBreak = ({ height = '0.8em' }: { height?: string }) => {
  return <span style={{ display: 'block', marginBottom: height }}></span>
}


export const LandingPage = () => {
  const taskType = useAppSelector((state: RootState) => state.task.taskType)
  const inputModality = useAppSelector((state: RootState) => state.task.inputModality)
  const purpose = useAppSelector((state: RootState) => state.task.purpose)
  const condition = useAppSelector((state: RootState) => state.task.condition)
  const [checked, setChecked] = useState(false)

  const handleSubmit: FormEventHandler = event => {
    event.preventDefault()

    return checked
  }

  const getInformedConsent = () => {
    if (purpose !== null && purpose !== undefined && purpose == "hcomp") {
      if (inputModality == 'gesture') {

        switch (taskType) {
          case "bird": {
            return <>
              We are a group of researchers at the Technical University of Delft in The Netherlands. In this research project, we aim to investigate the viability of gesture-based inputs for crowd-sourced microtasks. For example, consider you needed to complete a task that required the selection of one of two possible answers. Normally, this would be completed using a mouse and clicking a radio button or something similar. Instead, we are curious about how a gesture would be used, e.g., holding your palm upright, facing the webcam.
              <LineBreak />
              This task is part of the research project described above. We first walk you through a sample of how to interact with the gesture detection software, and give you a primer on how to recognize different bird beaks. In 10 following sub-tasks, you will inspect images of birds and specify the type of beak shape. At no time do we store your image or likeness from the gesture detection software.
              <LineBreak />
              Completion of these tasks requires a working webcam. Also required is the positioning of your body in specific gestures to provide input. Your participation in this task is entirely voluntary and you can withdraw at any time. We do not collect any data aside from the information described above and your Prolific user profile data that is automatically transmitted to us when you submit your answers.
              <LineBreak />
              We will keep your information confidential. All data is stored in a password protected electronic format. Be aware that the data we gather with this task might be published in an anonymized form later. Such an anonymized data set would include the answers you provide in this task, but no personal information (e.g., your worker ID) so that the answers will not be traceable back to you.
              <LineBreak />
              For the completion of this task, you will be rewarded at an hourly rate of 8 GBP.
              <LineBreak height="1.6em" />
              By clicking 'I consent' at the bottom of this page and completing the task, you confirm that you have read, understood, and consent to the above information.</>
          }
          case 'movie': {
            return <>
              We are a group of researchers at the Technical University of Delft in The Netherlands. In this research project, we aim to investigate the viability of gesture-based inputs for crowd-sourced microtasks. For example, consider you needed to complete a task that required the selection of one of two possible answers. Normally, this would be completed using a mouse and clicking a radio button or something similar. Instead, we are curious about how a gesture would be used, e.g., holding your palm upright, facing the webcam.
              <LineBreak />
              This task is part of the research project described above. We first walk you through a sample of how to interact with the gesture detection software. In 10 following sub-tasks, you will be presented with a written review about a film or TV show. Using the content of that review, you will select a star rating that you believe aligns with the sentiment of the content. These ratings can range from 1 to 5 stars.
              <LineBreak />
              Completion of these tasks requires a working webcam. Also required is the positioning of your body in specific gestures to provide input. Your participation in this task is entirely voluntary and you can withdraw at any time. We do not collect any data aside from the information described above and your Prolific user profile data that is automatically transmitted to us when you submit your answers.
              <LineBreak />
              We will keep your information confidential. All data is stored in a password protected electronic format. Be aware that the data we gather with this task might be published in an anonymized form later. Such an anonymized data set would include the answers you provide in this task, but no personal information (e.g., your worker ID) so that the answers will not be traceable back to you.
              <LineBreak />
              For the completion of this task, you will be rewarded at an hourly rate of 8 GBP.
              <LineBreak height="1.6em" />
              By clicking 'I consent' at the bottom of this page and completing the task, you confirm that you have read, understood, and consent to the above information.
            </>
          }
          case 'person': {
            return <>
              We are a group of researchers at the Technical University of Delft in The Netherlands. In this research project, we aim to investigate the viability of gesture-based inputs for crowd-sourced microtasks. For example, consider you needed to complete a task that required the selection of one of two possible answers. Normally, this would be completed using a mouse and clicking a radio button or something similar. Instead, we are curious about how a gesture would be used, e.g., holding your palm upright, facing the webcam.
              <LineBreak />
              This task is part of the research project described above. We first walk you through a sample of how to interact with the gesture detection software. In 10 following sub-tasks, you will be provided with the first and last name of a famous person. You will then need to find either the middle name or the profession of the individual shown. You are able to use any search tool at your disposal.
              <LineBreak />
              Completion of these tasks requires a working webcam. Also required is the positioning of your body in specific gestures to provide input. Your participation in this task is entirely voluntary and you can withdraw at any time. We do not collect any data aside from the information described above and your Prolific user profile data that is automatically transmitted to us when you submit your answers.
              <LineBreak />
              We will keep your information confidential. All data is stored in a password protected electronic format. Be aware that the data we gather with this task might be published in an anonymized form later. Such an anonymized data set would include the answers you provide in this task, but no personal information (e.g., your worker ID) so that the answers will not be traceable back to you.
              <LineBreak />
              For the completion of this task, you will be rewarded at an hourly rate of 8 GBP.
              <LineBreak height="1.6em" />
              By clicking 'I consent' at the bottom of this page and completing the task, you confirm that you have read, understood, and consent to the above information.
            </>
          }
        }
      } else {
        switch (taskType) {
          case "bird": {
            return <>
              We are a group of researchers at the Technical University of Delft in The Netherlands. In this research project, we aim to investigate the viability of gesture-based inputs for crowd-sourced microtasks. For example, consider you needed to complete a task that required the selection of one of two possible answers. Normally, this would be completed using a mouse and clicking a radio button or something similar. Instead, we are curious about how a gesture would be used, e.g., holding your palm upright, facing the webcam.
              <LineBreak />
              This task is part of the research project described above. We first give you an explanation of how to identify the type of beak a bird has, based on an image of the bird. Across 10 sub-tasks, you will inspect images of birds and specify the type of beak shape. There are 8 possible beak shapes.
              <LineBreak />
              Your participation in this task is entirely voluntary and you can withdraw at any time. We do not collect any data aside from the information described above and your Prolific user profile data that is automatically transmitted to us when you submit your answers.
              We will keep your information confidential. All data is stored in a password protected electronic format. Be aware that the data we gather with this task might be published in an anonymized form later. Such an anonymized data set would include the answers you provide in this task, but no personal information (e.g., your worker ID) so that the answers will not be traceable back to you.
              <LineBreak />
              For the completion of this task, you will be rewarded at an hourly rate of 8 GBP.
              <LineBreak height="1.6em" />
              By clicking 'I consent' at the bottom of this page and completing the task, you confirm that you have read, understood, and consent to the above information.</>
          }
          case 'movie': {
            return <>
              We are a group of researchers at the Technical University of Delft in The Netherlands. In this research project, we aim to investigate the viability of gesture-based inputs for crowd-sourced microtasks. For example, consider you needed to complete a task that required the selection of one of two possible answers. Normally, this would be completed using a mouse and clicking a radio button or something similar. Instead, we are curious about how a gesture would be used, e.g., holding your palm upright, facing the webcam.
              <LineBreak />
              This task is part of the research project described above. Across 10 sub-tasks, you will be presented with a written review about a film or TV show. Using the content of that review, you will select a star rating that you believe aligns with the sentiment of the content. These ratings can range from 1 to 5 stars.
              <LineBreak />
              Your participation in this task is entirely voluntary and you can withdraw at any time. We do not collect any data aside from the information described above and your Prolific user profile data that is automatically transmitted to us when you submit your answers.
              We will keep your information confidential. All data is stored in a password protected electronic format. Be aware that the data we gather with this task might be published in an anonymized form later. Such an anonymized data set would include the answers you provide in this task, but no personal information (e.g., your worker ID) so that the answers will not be traceable back to you.
              <LineBreak />
              For the completion of this task, you will be rewarded at an hourly rate of 8 GBP.
              <LineBreak height="1.6em" />
              By clicking 'I consent' at the bottom of this page and completing the task, you confirm that you have read, understood, and consent to the above information.
            </>
          }
          case 'person': {
            return <>
              We are a group of researchers at the Technical University of Delft in The Netherlands. In this research project, we aim to investigate the viability of gesture-based inputs for crowd-sourced microtasks. For example, consider you needed to complete a task that required the selection of one of two possible answers. Normally, this would be completed using a mouse and clicking a radio button or something similar. Instead, we are curious about how a gesture would be used, e.g., holding your palm upright, facing the webcam.
              <LineBreak />
              This task is part of the research project described above. Across 10 sub-tasks, you will be provided with the first and last name of a famous person. You will then need to find either the middle name or the profession of the individual shown. You are able to use any search tool at your disposal.
              <LineBreak />
              Your participation in this task is entirely voluntary and you can withdraw at any time. We do not collect any data aside from the information described above and your Prolific user profile data that is automatically transmitted to us when you submit your answers.
              We will keep your information confidential. All data is stored in a password protected electronic format. Be aware that the data we gather with this task might be published in an anonymized form later. Such an anonymized data set would include the answers you provide in this task, but no personal information (e.g., your worker ID) so that the answers will not be traceable back to you.
              <LineBreak />
              For the completion of this task, you will be rewarded at an hourly rate of 8 GBP.
  
              <LineBreak height="1.6em" />
              By clicking 'I consent' at the bottom of this page and completing the task, you confirm that you have read, understood, and consent to the above information.
            </>
          }
        }
      }
    } else {
      return <>
        We are a group of researchers at the Delft University of Technology in The Netherlands. In this research project, we aim to investigate input modalities in crowd-sourced microtasks. For example, consider you have a series of tasks that you need to complete. Typically, the solution is to use a mouse and keyboard to interact and make the proper selections. Our group has been investigating the use of gestures, i.e., specific motions captured by web cam, as a means of input. In this study, you may be asked to use both the gesture and mouse and keyboard input styles.
        <LineBreak />
        This task is part of the research project described above. We first walk you through a sample of how to interact with the gesture detection software. Afterwards, you will be presented with one of two tasks. In one variation, you will see a written review about a film or TV show. Using the content of that review, you will select a star rating that you believe aligns with the sentiment of the content. These ratings can range from 1 to 5 stars. You will be asked to do this for 10 reviews. The other variation will present you with images of birds, and asks you to identify the shape of the beak. You will be asked to annotate 10 images.  Between each task, you will be switching the input style used. You will be randomly assigned to a series of 3 batches (for a total of 30 prompts). The series may be all of the same type of tasks, as described prior, or a mixture of the two.
        <LineBreak />
        You will be presented with a questionnaire before and after the series of tasks. These questionnaires allow us to collect necessary information for the evaluation of this study.
        <LineBreak />
        Completion of these tasks requires a working webcam. Also required is the positioning of your body in specific gestures to provide input. Your participation in this task is entirely voluntary and you can withdraw at any time. We do not collect any data aside from the information described above and your Prolific user profile data that is automatically transmitted to us when you submit your answers. 
        <LineBreak />
        We will keep your information confidential. All data is stored in a password protected electronic format. Be aware that the data we gather with this task might be published in an anonymized form later. Such an anonymized data set would include the answers you provide in this task, but no personal information (e.g., your worker ID) so that the answers will not be traceable back to you. 
        <LineBreak />
        For the completion of this task, you will be rewarded at a fair hourly rate. If your performance falls in the top 25th percentile, you will qualify for a bonus reward.

        <LineBreak height="1.6em" />
        By clicking 'I consent' at the bottom of this page and completing the task, you confirm that you have read, understood, and consent to the above information.
      </>
    }
  }

  return (
    <CenterPage>
      <Typography variant='h4' marginBottom='1em'>Welcome to HealthBytes!</Typography>

      <Typography variant='subtitle1' marginBottom='1em' fontWeight='medium' textTransform='uppercase'>Informed consent form</Typography>
      <Typography variant='body2' marginBottom='2em' textAlign='justify' lineHeight={1.6} >{getInformedConsent()}</Typography>

      <NextButton buttonText="I consent" type="submit" form="consentForm" />
    </CenterPage>
  )
}