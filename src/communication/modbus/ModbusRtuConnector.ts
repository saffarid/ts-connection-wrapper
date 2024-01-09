import ModbusRTU from 'modbus-serial'
import {IConnection, IDictionary} from '../../interfaces/interfaces'
import {ReadCoilResult, ReadRegisterResult, WriteCoilResult, WriteRegisterResult} from "modbus-serial/ModbusRTU";
import {ModbusRegisterTypes} from "./../../enums/enums";
import {sleep} from "../../utils";

export class ModbusRtuConnector implements IConnection
{
  private client: ModbusRTU

  private readonly config: IDictionary<any>
  private isOpenClose = false

  constructor(config: IDictionary<any>) {
    this.config = config
    this.client = new ModbusRTU()
  }

  public start = async () => {
    await this.client.connectRTU(this.config.PORT, {baudRate: this.config.BAUD_RATE})
    while (!this.client.isOpen) await sleep(500)
    this.client.setTimeout(500)
  }

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
  write = (args: { [p: string]: any }): Promise<any> => {
    return new Promise(async (resolve, reject) => {

        const handleError = (e: any) => {
          if ('code' in e) {
            switch (e.code) {
              case 'ECONNREFUSED': {
                reject(e)
                return
              }
            }
          }
          if (this.isOpenClose) this.client.close(() => reject(e))
          else reject(e)
        }
        try {
          if (this.isOpenClose) {
            // this.client = new ModbusRTU()
            // await this.client.connectRTU(this.config.PORT, {baudRate: this.config.BAUD_RATE})
            this.client.open(() => {})
            while (!this.client.isOpen) await sleep(500)
          }

          this.client.setID(args.slaveId)
          let res: Promise<WriteRegisterResult> | Promise<WriteCoilResult>
          let _res: WriteRegisterResult | WriteCoilResult
          if (<boolean>args.isDiscrete) res = this.client.writeCoil(<number>args.address, <boolean>args.value)
          else res = this.client.writeRegister(<number>args.address, <number>args.value)

          if (<number>args.slaveId != 0) {
            res
              .then((value: any) => {
                if (this.isOpenClose) this.client.close(() => resolve(value))
                else resolve(value)
              })
              .catch(handleError)
          }
          else {
            res.catch(handleError)
          }
        } catch (e: any) {
          handleError(e)
        }
      }
    )

  }

  readOne = (args: { [p: string]: any }): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const handleError = (e: any) => {
        if ('code' in e) {
          switch (e.code) {
            case 'ECONNREFUSED': {
              reject(e)
              return
            }
          }
        }
        if (this.isOpenClose) this.client.close(() => reject(e))
        else reject(e)
      }

      try {
        if (this.isOpenClose) {
          // this.client = new ModbusRTU()
          // await this.client.connectRTU(this.config.PORT, {baudRate: this.config.BAUD_RATE})
          this.client.open(() => {})
          while (!this.client.isOpen) await sleep(500)
        }
        this.client.setID(args.slaveId)
        let res: Promise<ReadRegisterResult> | Promise<ReadCoilResult>

        switch (args.type) {
          case ModbusRegisterTypes.COILS: {
            res = this.client.readCoils(<number>args.address, 1)
            break
          }
          case ModbusRegisterTypes.INPUT_REGISTERS: {
            res = this.client.readInputRegisters(<number>args.address, 1)
            break
          }
          case ModbusRegisterTypes.HOLDING_REGISTERS:
          default: {
            res = this.client.readHoldingRegisters(<number>args.address, 1)
            break
          }
        }

        res
          .then((value: any) => {
            if (args.type == ModbusRegisterTypes.COILS) {
              if (this.isOpenClose) this.client.close(() => resolve(value.data[0] ? 1 : 0))
              else resolve(value.data[0] ? 1 : 0)
              return
            }
            if (this.isOpenClose) this.client.close(() => resolve(value.data[0]))
            else resolve(value.data[0])
          })
          .catch(handleError)

      } catch (e: any) {
        handleError(e)
      }
    })

  }

  ping = (args: { [p: string]: any }) => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("Open")
        await this.client.connectRTUBuffered(this.config.PORT, {baudRate: this.config.BAUD_RATE})
        // console.log("Check open")
        while (!this.client.isOpen) await sleep(500)
        // console.log("Open good")
        this.client.close(() => resolve(''))

      } catch (e: any) {
        // console.log(570, e)
        if ('code' in e) {
          switch (e.code) {
            case 'ECONNREFUSED': {
              reject(e)
              return
            }
          }
        }
        this.client.close(() => reject(e))
      }

    })

  }
}
