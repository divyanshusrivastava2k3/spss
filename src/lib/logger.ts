type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    const isDev = process.env.NODE_ENV !== 'production';
    
    // Redact sensitive info
    let safeMeta = meta;
    if (meta && typeof meta === 'object') {
      safeMeta = JSON.parse(JSON.stringify(meta));
      const redactKeys = ['password', 'token', 'secret', 'NEXTAUTH_SECRET'];
      const redact = (obj: any) => {
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            redact(obj[key]);
          } else if (redactKeys.includes(key) || redactKeys.some(k => key.toLowerCase().includes(k))) {
            obj[key] = '[REDACTED]';
          }
        }
      };
      redact(safeMeta);
    }

    if (isDev) {
      const colors = { debug: '\x1b[34m', info: '\x1b[32m', warn: '\x1b[33m', error: '\x1b[31m' };
      const reset = '\x1b[0m';
      console[level](`${colors[level]}[${level.toUpperCase()}] ${message}${reset}`, safeMeta ? safeMeta : '');
    } else {
      console[level](JSON.stringify({ level, message, meta: safeMeta, timestamp: new Date().toISOString() }));
    }
  }

  debug(message: string, meta?: any) { this.log('debug', message, meta); }
  info(message: string, meta?: any) { this.log('info', message, meta); }
  warn(message: string, meta?: any) { this.log('warn', message, meta); }
  error(message: string, meta?: any) { this.log('error', message, meta); }
}

export const logger = new Logger();
