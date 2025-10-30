const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const jobTypes = require('./job.types');


async function processPrime(data) {
  logger.info('Processing Prime job', { data });

  const limit = data.limit;
  if (typeof limit !== 'number') {
    logger.error('Invalid limit for prime calculation', { limit });
    throw new Error('Invalid limit for prime calculation');
  }

  let primes = [];
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }

  logger.info(`Prime job completed, found ${primes.length} primes`);
  return primes;
}


async function processHash(data) {
  logger.info('Processing Hash job', data);

  const text = data.text;
  if (!text) {
    logger.error('Text is required for hashing', { data });
    throw new Error('Text is required for hashing');
  }

  const rounds = 10;
  let hash = text;
  for (let i = 0; i < rounds; i++) {
    hash = await bcrypt.hash(hash, 10);
  }

  logger.info('Hash job completed', { hash: hash.slice(0, 10) + '...' });
  return hash;
}


async function processSort(data) {
  logger.info('Processing Sort job', { data });

  const size = data.size;
  if (typeof size !== 'number') {
    logger.error('Size is required for sorting', { data });
    throw new Error('Size is required for sorting');
  }

  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 100000));
  arr.sort((a, b) => a - b);

  logger.info(`Sort job completed, sorted ${arr.length} numbers`);
  return arr;
}


async function processMatrix(data) {
  logger.info('Processing Matrix job', { data });

  const size = data.size;
  if (typeof size !== 'number') {
    logger.error('Size is required for matrix multiplication', { data });
    throw new Error('Size is required for matrix multiplication');
  }

  const matrix = Array.from({ length: size }, () => Array.from({ length: size }, () => Math.random()));
  let result = matrix.map((row, i) =>
    row.map((_, j) =>
      row.reduce((sum, val, k) => sum + val * matrix[k][j], 0)
    )
  );

  logger.info('Matrix job completed', { size });
  return result;
}


async function processFibonacci(data) {
  logger.info('Processing Fibonacci job', { data });

  const n = data.n;
  if (typeof n !== 'number') {
    logger.error('n is required for Fibonacci sequence', { data });
    throw new Error('n is required for Fibonacci sequence');
  }

  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }

  logger.info(`Fibonacci job completed, sequence length: ${fib.length}`);
  return fib;
}

module.exports = {
  [jobTypes.PRIME]: processPrime,
  [jobTypes.HASH]: processHash,
  [jobTypes.SORT]: processSort,
  [jobTypes.MATRIX]: processMatrix,
  [jobTypes.FIBONACCI]: processFibonacci,
};
