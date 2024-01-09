declare module 'connection-wrapper' {
  import {
    EModbusFunctions,
  } from './src/enums/enums'
  import {
    IDictionary,
  } from './src/interfaces/interfaces'
  import {ConnectionFactory} from "./src/communication/ConnectionFactory";

  export {
    EModbusFunctions,
    IDictionary,
    ConnectionFactory
  }

}