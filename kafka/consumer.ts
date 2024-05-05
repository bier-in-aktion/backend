import path from 'path';
import { Kafka } from 'kafkajs';
import { avdlToAVSCAsync, SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import CONFIG from '../config/config.loader';
import { inject, injectable } from 'inversify';
import TYPES from '../inversify/inversify.types';
import { ProductService } from '../service/product-service';

@injectable()
export class Consumer {
    private registry = new SchemaRegistry({ host: CONFIG.KAFKA.SCHEMA_REGISTRY_HOST });
    private kafka = new Kafka({
        brokers: CONFIG.KAFKA.BROKERS,
        clientId: CONFIG.KAFKA.CLIENT_ID,
    });

    private consumer = this.kafka.consumer({ groupId: CONFIG.KAFKA.GROUP_ID });

    constructor(@inject(TYPES.ProductService) private productService: ProductService) {}

    public async start() {
        this.run().catch(async e => {
            this.consumer && await this.consumer.disconnect();
            throw e;
        });
    }

    private async run() {
        const schema = await avdlToAVSCAsync(path.join(__dirname, 'product.avdl'));
        const { id } = await this.registry.register({ type: SchemaType.AVRO, schema: JSON.stringify(schema) });

        await this.consumer.connect();

        await this.consumer.subscribe({ topic: CONFIG.KAFKA.TOPIC });

        await this.consumer.run({
            eachMessage: async ({ topic: string, partition: number, message }) => {
                if (message?.value == null || message?.key == null) return;

                const decodedMessage = {
                    // ...message,
                    key: message.key.toString(),
                    value: await this.registry.decode(message.value),
                };

                this.productService.addOrUpdateProduct(decodedMessage.key, decodedMessage.value);
            },
        });
    }
}
