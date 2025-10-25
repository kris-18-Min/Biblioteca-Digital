import amqp from 'amqplib';
import fs from 'fs';

export class AuditConsumer {
  constructor(url) {
    this.url = url;
    this.queue = 'events';
  }

  async start() {
    this.conn = await amqp.connect(this.url);
    this.channel = await this.conn.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });
    console.log('Audit consumer connected, waiting messages...');
    this.channel.consume(this.queue, msg => {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log('Received event:', content);
        // append to a local log file as evidence/auditoría
        fs.appendFileSync('logs/audit.log', new Date().toISOString() + ' ' + content + '\n');
        this.channel.ack(msg);
      }
    });
  }
}
