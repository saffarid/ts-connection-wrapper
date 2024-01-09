import {IConnection} from './../interfaces/interfaces'
import {ModbusTcpConnector} from './modbus/ModbusTcpConnector'
import {ModbusRtuConnector} from './modbus/ModbusRtuConnector'
import {ModbusEmuConnector} from './modbus/ModbusEmuConnector'

export class ConnectionFactory {
  private static instance: ConnectionFactory

  private factory: { [key: string]: (config: { [key: string]: any }) => IConnection }

  constructor() {
    this.factory = {
      'modbus-tcp': (config: { [key: string]: any }) => new ModbusTcpConnector(config),
      'modbus-rtu': (config: { [key: string]: any }) => new ModbusRtuConnector(config),
      'modbus-emu': (config: { [key: string]: any }) => new ModbusEmuConnector(config),
    }
  }

  public getConnection = (key: string, config: { [key: string]: any }) => {
    return this.factory[key](config)
  }

  public static getInstance = () => {
    if (!ConnectionFactory.instance) {
      ConnectionFactory.instance = new ConnectionFactory()
    }
    return ConnectionFactory.instance
  }


}