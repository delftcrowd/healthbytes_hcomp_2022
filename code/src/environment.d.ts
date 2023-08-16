declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_SERVER_URL?: string,
      REACT_APP_COMPLETION_CODE?: string,
      REACT_APP_PRE_TASK_QUALTRICS_URL?: string,
      REACT_APP_POST_TASK_QUALTRICS_URL?: string,
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
