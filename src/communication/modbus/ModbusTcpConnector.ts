import ModbusRTU from 'modbus-serial'
import {IConnection, IDictionary, IParam} from '../../interfaces/interfaces'

export class ModbusTcpConnector implements IConnection {

  private readonly ip: string
  private readonly port: number
  private readonly client: ModbusRTU

  constructor(
    config: IDictionary<any>
  ) {
    this.ip = config.ip
    this.port = config.port
    this.client = new ModbusRTU()
  }


  public start = async () => {
  }

  read(args: { [p: string]: any }): Promise<any> {
    return Promise.resolve(undefined);
  }

  write(args: { [p: string]: any }): Promise<any> {
    return Promise.resolve(undefined);
  }

  readOne(args: { [p: string]: any }): Promise<any> {
    return Promise.resolve(undefined);
  }

  ping(args: { [p: string]: any }): Promise<any> {
    return Promise.resolve(undefined);
  }
}
