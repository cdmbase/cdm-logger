import * as Logger from 'bunyan';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { ILoggerSettings, makeLogger, getSettingsLevel, CdmLogger } from '@cdm-logger/core';

export interface IFileLoggerSettings extends ILoggerSettings, Logger.Stream {
    /** defaults to short */
    mode?: 'short' | 'long' | 'dev' | 'raw';
    logPath: string;
}

export function getFileLogStream(settings: IFileLoggerSettings, name: string) {
    mkdirp.sync(settings.logPath);
    const logFile = path.join(settings.logPath, `${name}.log`);
    return {
        level: getSettingsLevel(settings),
        streams: [
            {
                type: 'rotating-file',
                path: logFile,
                period: settings.period || '1d',
                count: settings.period || 3,
            }
        ]
    }
}

export class FileLogger {
    static create(name: string | Object, settings?: IFileLoggerSettings) {
        return makeLogger(Logger, name, getFileLogStream(settings, name.toString()));
    }
}