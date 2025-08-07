import Slider from './Slider';
import { VideoDuration } from './types';
import { getFullTimerLabel, getVideoDurationUnits, padStartNumber } from './utils';

interface DurationProps {
  duration: number;
  currentTime: number;
  updateCurrentTime: (time: number) => void;
}

export default function Duration({ duration, currentTime, updateCurrentTime }: DurationProps) {
  const currentTimeDuration = getVideoDurationUnits(currentTime);
  const timeRemaining = getVideoDurationUnits(duration - currentTime);

  return (
    <div className="duration-container">
      <time
        role="timer"
        dateTime={getAriaTimerValue(currentTimeDuration)}
        aria-label={`Time elapsed ${getFullTimerLabel(currentTimeDuration)}`}
        className="duration-time"
      >
        {getVideoDurationLabel(currentTimeDuration)}
      </time>
      <Slider duration={duration} currentTime={currentTime} updateCurrentTime={updateCurrentTime} />
      <time
        role="timer"
        dateTime={getAriaTimerValue(timeRemaining)}
        aria-label={`Time remaining ${getFullTimerLabel(timeRemaining)}`}
        className="duration-time"
      >
        <span aria-hidden="true">- </span>
        {getVideoDurationLabel(timeRemaining)}
      </time>
    </div>
  );
}

const getAriaTimerValue = (durationValues: VideoDuration) => {
  const { hours, minutes, seconds } = durationValues;
  const dateTimeValue = `PT${hours > 0 ? `${hours}H` : ''}${minutes > 0 ? `${minutes}M` : ''}${`${seconds}S`}`;
  return dateTimeValue;
};

const getVideoDurationLabel = ({ hours, minutes, seconds }: VideoDuration) => {
  if (hours > 0) return `${hours}:${padStartNumber(minutes)}:${padStartNumber(seconds)}`;
  return `${padStartNumber(minutes)}:${padStartNumber(seconds)}`;
};
