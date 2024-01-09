

export interface IDictionary<T>{
  [key:string]: T
}

export interface IConnection {
  start: () => void
  write: (args: { [key: string]: any }) => Promise<void>
  read: (args: { [key: string]: any }) => Promise<any[]>
  readOne: (args: { [key: string]: any }) => Promise<any>
  ping: (args: { [key: string]: any }) => Promise<any>
}

export interface IArg {
  config: IDictionary<any>
}