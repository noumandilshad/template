import 'reflect-metadata';
import { Container } from 'inversify';
import { HelloWorldController } from './src/controllers/HelloWorldController';
import { HelloWorldControllerInterface } from './src/controllers/HelloWorldControllerInterface';
import { TYPES } from './src/types/types';
import { AppInterface } from './src/AppInterface';
import { HelloWorldApp } from './src/App';
import { Fetcher, FetcherInterface } from './src/core/Fetcher';
import { HelloWorldRouter } from './src/routes/HelloWorldRoutes/HelloWorldRouter';
import { HelloWorldRouterInterface } from './src/routes/HelloWorldRoutes/HelloWorldRouterInterface';

const appContainer = new Container();
appContainer.bind<HelloWorldRouterInterface>(TYPES.HelloWorldRouterInterface).to(HelloWorldRouter);
appContainer.bind<HelloWorldControllerInterface>(TYPES.HelloWorldControllerInterface).to(HelloWorldController);
appContainer.bind<AppInterface>(TYPES.AppInterface).to(HelloWorldApp);
appContainer.bind<FetcherInterface>(TYPES.FetcherInterface).to(Fetcher);

export { appContainer };
