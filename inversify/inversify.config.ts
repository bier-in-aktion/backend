// import TYPES from './inversify.types';
import { AsyncContainerModule } from 'inversify';

export const BINDINGS = new AsyncContainerModule (
    async bind => {
        // await initializeDataSource();

        await require('../controller/test-controller');
    }
);
