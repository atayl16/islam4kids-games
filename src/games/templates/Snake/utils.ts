import { Position, SnakeSegment, Direction, GRID_SIZE } from './types';

/**
 * Generate random food position that doesn't overlap with snake
 */
export const generateFood = (snake: SnakeSegment[]): Position => {
  let food: Position;
  let isOnSnake: boolean;

  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    isOnSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
  } while (isOnSnake);

  return food;
};

/**
 * Check if two positions are equal
 */
export const positionsEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

/**
 * Get the next head position based on direction
 */
export const getNextHeadPosition = (head: Position, direction: Direction): Position => {
  switch (direction) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
  }
};

/**
 * Check if position is out of bounds
 */
export const isOutOfBounds = (pos: Position): boolean => {
  return pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE;
};

/**
 * Check if snake collides with itself
 */
export const checkSelfCollision = (head: Position, body: SnakeSegment[]): boolean => {
  return body.some(segment => positionsEqual(segment, head));
};

/**
 * Check if direction change is valid (prevent 180-degree turns)
 */
export const isValidDirectionChange = (currentDirection: Direction, newDirection: Direction): boolean => {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };

  return opposites[currentDirection] !== newDirection;
};

/**
 * Calculate score based on snake length and difficulty
 */
export const calculateScore = (snakeLength: number, difficulty: 'easy' | 'medium' | 'hard'): number => {
  const baseScore = (snakeLength - 3) * 10; // -3 for initial length
  const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
  return Math.floor(baseScore * multiplier);
};
