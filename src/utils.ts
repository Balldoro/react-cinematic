import { VideoDuration } from './types';

export const padStartNumber = (number: number) => number.toString().padStart(2, '0');

export const getFullTimerLabel = (durationValues: VideoDuration) => {
  const { hours, minutes, seconds } = durationValues;
  return `${hours > 0 ? `${hours} hours` : ''}${minutes > 0 ? `${minutes} minutes` : ''}${seconds > 0 ? `${seconds} seconds` : ''}`;
};

export const getVideoDurationUnits = (duration: number): VideoDuration => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  return { hours, minutes, seconds };
};
