import type {
  AnimationData,
  WorkerEvent
} from '@/types'

import { loadAsset } from '@/utils/AssetLoader'
import DataFunctions from '@/utils/DataFunctions'
import { isServer } from '@/utils/helpers/constants'
import { getWebWorker } from '@/utils/helpers/worker'

interface Message { data: string }
interface MessageData {
  id: string
  payload?: unknown
  status: string
}

let _counterId = 1,
  workerFn: (e: WorkerEvent) => void

const funcitonNotImplemented = 'Function not implemented.',

  workerProxy: Worker = {
    addEventListener: <K extends keyof WorkerEventMap>(
      _type: K,
      _listener: (ev: WorkerEventMap[K]) => unknown,
      _options?: boolean | AddEventListenerOptions
    ): void => {
      throw new Error(funcitonNotImplemented)
    },
    dispatchEvent: (_: Event): boolean => {
      throw new Error(funcitonNotImplemented)
    },
    onerror: null,
    onmessage: (_: Message) => {
      throw new Error('workerProxy: Method onmessage not implemented')
    },
    onmessageerror: null,
    postMessage: (data: WorkerEvent['data']) => {
      workerFn({ data })
    },
    removeEventListener: <K extends keyof WorkerEventMap>(
      _type: K,
      _listener: (ev: WorkerEventMap[K]) => unknown,
      _options?: boolean | EventListenerOptions
    ): void => {
      throw new Error(funcitonNotImplemented)
    },
    terminate: (): void => {
      throw new Error(funcitonNotImplemented)
    },
  },
  _workerSelf: {
    dataManager?: typeof DataFunctions
    postMessage: (data: MessageData) => void
  } = {
    postMessage: (data: MessageData) => {
      if (!workerProxy.onmessage) {
        return
      }
      workerProxy.onmessage({
        AT_TARGET: 2,
        bubbles: false,
        BUBBLING_PHASE: 3,
        cancelable: false,
        cancelBubble: false,
        CAPTURING_PHASE: 1,
        composed: false,
        composedPath: (): EventTarget[] => {
          throw new Error(funcitonNotImplemented)
        },
        currentTarget: null,
        data,
        defaultPrevented: false,
        eventPhase: 0,
        initEvent: (
          _type: string,
          _bubbles?: boolean,
          _cancelable?: boolean
        ): void => {
          throw new Error(funcitonNotImplemented)
        },
        initMessageEvent: (
          _type: string,
          _bubbles?: boolean,
          _cancelable?: boolean,
          _data?: unknown,
          _origin?: string,
          _lastEventId?: string,
          _source?: MessageEventSource | null,
          _ports?: MessagePort[]
        ): void => {
          throw new Error(funcitonNotImplemented)
        },
        isTrusted: false,
        lastEventId: '',
        NONE: 0,
        origin: '',
        ports: [],
        preventDefault: (): void => {
          throw new Error(funcitonNotImplemented)
        },
        returnValue: false,
        source: null,
        srcElement: null,
        stopImmediatePropagation: (): void => {
          throw new Error(funcitonNotImplemented)
        },
        stopPropagation: (): void => {
          throw new Error(funcitonNotImplemented)
        },
        target: null,
        timeStamp: 0,
        type: '',
      })
    },
  },
  processes: {
    [key: string]: {
      onComplete: (data: AnimationData) => void
      onError?: (error?: unknown) => void
    }
  } = {}
let workerInstance: Worker | undefined

function createWorker(fn: (e: WorkerEvent) => unknown): Worker {
  if (!isServer && getWebWorker()) {
    const blob = new Blob(['var _workerSelf = self; self.onmessage = ', fn.toString()],
      { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)

    return new Worker(url)
  }
  workerFn = fn

  return workerProxy
}

function setupWorker() {
  if (workerInstance) {
    return
  }

  // _workerSelf.dataManager = _workerSelf.dataManager ?? DataFunctions

  workerInstance = createWorker((e) => {
    _workerSelf.dataManager = _workerSelf.dataManager ?? DataFunctions
    if (e.data.type === 'loadAnimation') {
      loadAsset(
        e.data.path,
        e.data.fullPath,
        (data) => {
          if (data) {
            DataFunctions.completeData(data)
          }

          _workerSelf.postMessage({
            id: e.data.id,
            payload: data,
            status: 'success',
          })
        },
        () => {
          _workerSelf.postMessage({
            id: e.data.id,
            status: 'error',
          })
        }
      )

      return
    }
    if (e.data.type === 'complete') {
      const { animation, id } = e.data

      DataFunctions.completeData(animation)
      _workerSelf.postMessage({
        id,
        payload: animation,
        status: 'success',
      })

      return
    }
    if (e.data.type === 'loadData') {
      loadAsset(
        e.data.path,
        e.data.fullPath,
        (data) => {
          _workerSelf.postMessage({
            id: e.data.id,
            payload: data,
            status: 'success',
          })
        },
        () => {
          _workerSelf.postMessage({
            id: e.data.id,
            status: 'error',
          })
        }
      )
    }
  })

  workerInstance.onmessage = ({ data }) => {
    const {
        id, payload, status
      } = data as {
        id: string;
        status: string;
        payload: AnimationData
      },
      process = processes[id]

    processes[id] = null as any
    if (status === 'success') {
      process?.onComplete(payload)

      return
    }
    if (process?.onError) {
      process.onError()
    }
  }
}

function createProcess(onComplete: (data: AnimationData) => void,
  onError?: (error?: unknown) => void) {
  _counterId++
  const id = `processId_${_counterId}`

  try {
    processes[id] = {
      onComplete,
      onError,
    }

    return id
  } catch (error) {
    console.error('DataManager}:\n', error)
    throw new Error('Could not create animation proccess')
  }
}

export function loadAnimation(
  path: string,
  onComplete: (data: AnimationData) => void,
  onError?: (error?: unknown) => void
) {
  setupWorker()
  const processId = createProcess(onComplete, onError)

  workerInstance?.postMessage({
    fullPath: isServer
      ? path
      : window.location.origin + window.location.pathname,
    id: processId,
    path,
    type: 'loadAnimation',
  })
}

export function loadData(
  path: string,
  onComplete: (data: AnimationData) => void,
  onError?: (error?: unknown) => void
) {
  setupWorker()
  const processId = createProcess(onComplete, onError)

  workerInstance?.postMessage({
    fullPath: isServer
      ? path
      : window.location.origin + window.location.pathname,
    id: processId,
    path,
    type: 'loadData',
  })
}

export function completeAnimation(
  animation: AnimationData,
  onComplete: (data: AnimationData) => void,
  onError?: (error?: unknown) => void
) {
  setupWorker()
  const processId = createProcess(onComplete, onError)

  workerInstance?.postMessage({
    animation,
    id: processId,
    type: 'complete',
  })
}

const DataManager = {
  completeAnimation,
  loadAnimation,
  loadData,
}


export default DataManager
