import { useCurtain } from '../context/CurtainContext';

export const useSensorData = () => {
  const { sensorData, sensorHistory, setSensorData } = useCurtain();

  // Helper labels and status classifications
  const getLightCondition = (lux) => {
    if (lux > 700) return { label: 'Bright', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400' };
    if (lux >= 250) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' };
    return { label: 'Dim / Night', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400' };
  };

  const getTempCondition = (temp) => {
    if (temp > 30) return { label: 'Warm', color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400' };
    if (temp >= 20) return { label: 'Comfortable', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' };
    return { label: 'Cool', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' };
  };

  const getHumidityCondition = (hum) => {
    if (hum > 70) return { label: 'High', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400' };
    if (hum >= 40) return { label: 'Normal', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' };
    return { label: 'Dry', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400' };
  };

  return {
    ...sensorData,
    history: sensorHistory,
    setSensorData,
    lightCondition: getLightCondition(sensorData.light),
    tempCondition: getTempCondition(sensorData.temperature),
    humidityCondition: getHumidityCondition(sensorData.humidity)
  };
};

export default useSensorData;
