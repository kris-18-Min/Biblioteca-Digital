import amqp from 'amqplib';

export class RabbitPublisher {
  constructor(url) {
    this.url = url;
    this.conn = null;
    this.channel = null;
    this.queue = 'events';
    this.init().catch(err => console.error('Publisher init error', err));
  }

  async init() {
    this.conn = await amqp.connect(this.url);
    this.channel = await this.conn.createChannel();
    await this.channel.assertQueue(this.queue, { durable: true });
  }

  async publish(eventType, payload) {
    if (!this.channel) await this.init();
    const message = { type: eventType, payload, createdAt: new Date().toISOString() };
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log('Published', eventType);
  }
}
