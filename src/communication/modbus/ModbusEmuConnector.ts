
import {IConnection, IArg, IDictionary} from '../../interfaces/interfaces'
import {ModbusRegisterTypes} from "./../../enums/enums";

export class ModbusEmuConnector implements IConnection
{
  private readonly config: IDictionary<any>

  constructor(config: IDictionary<any>) {
    this.config = config
  }

  public start = async () => console.log('ModbusEmu start')

  read(args: { [p: string]: any }): Promise<any> {
    return Promise.resolve(undefined);
  }

  /**
   * args = {
   * 	slaveId: number,
   * 	address: number,
   * 	value: boolean | number,
   * 	isDiscrete: boolean
   * }
   * */
  write(args: { [p: string]: any }): Promise<any> {
    if (<boolean>args.isDiscrete) {
      return new Promise((resolve, reject) => resolve({address: <number>args.address, state:<boolean>args.value}))
    }
    else {
      return new Promise((resolve, reject) => resolve({address: <number>args.address, value:<boolean>args.value}))
    }
  }

  readOne = async (args: { [p: string]: any }): Promise<any> => {
      switch (args.type) {
        case ModbusRegisterTypes.COILS: {
          return Math.round(Math.random())
        }
        case ModbusRegisterTypes.INPUT_REGISTERS: {
          return 65535*Math.random()
        }
        case ModbusRegisterTypes.HOLDING_REGISTERS: {
          return 65535*Math.random()
        }
        default: {
          return -1
        }
      }
  }

  ping(args: { [p: string]: any }): Promise<any> {
    return Promise.resolve(undefined);
  }
}
