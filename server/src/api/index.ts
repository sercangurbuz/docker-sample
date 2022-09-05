import { Items, PrismaClient } from '@prisma/client';
import express from 'express';
import * as redis from 'redis';

const { REDIS_HOST, REDIS_PORT } = process.env;

const router = express.Router();

const prisma = new PrismaClient();
const clientRedis = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});


clientRedis.on('connect', () => 'redis connected !');
clientRedis.on('error', (err) => console.log('Redis Client Error', err));
clientRedis.connect();

router.get<{}, Items[]>('/', async (req, res) => {
  const cache = await clientRedis.get('todos');

  if (cache) {
    res.json(JSON.parse(cache));
    return;
  }

  const items = await prisma.items.findMany({
    orderBy: [{ createdOn: 'desc' }],
  });

  await clientRedis.set('todos', JSON.stringify(items));
  res.json(items);
});

router.post<Items, Items>('/', async (req, res) => {
  const { text, id = 0, done = false } = req.body;
  const result = await prisma.items.upsert({
    create: {
      text,
      done: false,
    },
    update: {
      text,
      id,
      done,
    },
    where: {
      id,
    },
  });
  await clientRedis.del('todos');
  res.json(result);
});

router.delete<Items, Items>('/', async (req, res) => {
  const { id } = req.query;
  const result = await prisma.items.delete({
    where: {
      id: +id!,
    },
  });
  await clientRedis.del('todos');
  res.json(result);
});

export default router;
