import * as bunyan from "bunyan";
import * as bunyanLogstashAmqp from "bunyan-logstash-amqp";
import {ILoggerFactory,ILoggerSettings,makeLogger,getSettingsLevel,LoggerLevel} from "./core";
import {getConsoleStream,IConsoleLoggerSettings} from "./consoleLogger";

export interface ILogstashAmqpLoggerSettings extends ILoggerSettings {
  host: string;
  port: number;
  exchange?: string;
}

export function getLogstashAmqpStream(settings: ILogstashAmqpLoggerSettings): bunyan.Stream {
  if (!settings) {
    throw new Error("Cannot create a LogstashAmqpLogger without settings")
  }
  if (!settings.host || !settings.port) {
    throw new Error("Cannot create a LogstashAmqpLogger without logstash settings")
  }

  return {
    type: "raw",
    stream: bunyanLogstashAmqp.createStream({
      level: getSettingsLevel(settings),
      host: settings.host,
      port: settings.port,
      exchange: settings.exchange || "logs"
    })
  }
}

export class LogstashAmqpLogger {
  static create(name: string, settings: ILogstashAmqpLoggerSettings, consoleLoggerSettings?: IConsoleLoggerSettings) {
    const streams = [getLogstashAmqpStream(settings)]
    //if (process.env.NODE_ENV !== "production") {
    if (consoleLoggerSettings) {
      streams.push(getConsoleStream(consoleLoggerSettings));
    }

    return makeLogger(name, ...streams);
  }
}
