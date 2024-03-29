import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ResponsiveLine } from '@nivo/line';
import React from 'react';
import { InfoBlock } from '../DatabaseInfo';
import { DirectionButton } from '../WordCollection/CollectionControlPanel/DirectionButton';
import { useControlLineChart } from './useControlLineChart';
import { useTranslation } from 'react-i18next';

export const LineChartContainer = () => {
  const chartControl = useControlLineChart();
  const { t } = useTranslation();

  const {
    noContextData,
    dateOption,
    setLatestDate,
    isMoreThanTwelveMonth,
    isMoreThanOneMonth,
    handleToNextAdjacentPeriod,
    handleToPreviousAdjacentPeriod,
    periodTitle,
  } = chartControl;
  if (noContextData) return null;
  const handleChange = (e, newValue) => {
    setLatestDate(newValue);
  };
  const showDirectionButton =
    (dateOption.datePrecision === 'month' && isMoreThanTwelveMonth) ||
    (dateOption.datePrecision === 'day' && isMoreThanOneMonth);

  return (
    <InfoBlock sx={{ width: 'auto', height: '300px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>{t('Total Savings Over Time')}</Typography>
        <Typography>{periodTitle}</Typography>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <ToggleButtonGroup
          size="small"
          color="primary"
          value={dateOption.datePrecision}
          exclusive
          onChange={handleChange}
          sx={{ bgcolor: 'background.paper' }}
        >
          <ToggleButton
            disabled={dateOption.datePrecision === 'month'}
            value="month"
          >
            {t('12 months')}
          </ToggleButton>
          <ToggleButton
            disabled={dateOption.datePrecision === 'day'}
            value="day"
          >
            {t('30 days')}
          </ToggleButton>
        </ToggleButtonGroup>
        {showDirectionButton && (
          <>
            <DirectionButton
              isForward={false}
              clickHandler={() => {
                handleToPreviousAdjacentPeriod(dateOption.datePrecision);
              }}
            />
            <DirectionButton
              isForward={true}
              clickHandler={() => {
                handleToNextAdjacentPeriod(dateOption.datePrecision);
              }}
            />
          </>
        )}
      </Box>
      <Box sx={{ height: '210px' }}>
        <LineChart chartControl={chartControl} />
      </Box>
    </InfoBlock>
  );
};

const LineChart = ({ chartControl }) => {
  const { dateOption, currentConfig, chartData, setCertainMonth } =
    chartControl;

  const handleClickPoint = (point) => {
    const dateTarget = point.data.xFormatted;
    if (dateOption.datePrecision === 'month') {
      setCertainMonth(dateTarget);
    }
  };

  return (
    <ResponsiveLine
      data={chartData}
      margin={{ top: 20, right: 30, bottom: 25, left: 30 }}
      xScale={{
        type: 'time',
        format: currentConfig.xFormat,
        useUTC: false,
        precision: dateOption.datePrecision,
      }}
      xFormat={`time:${currentConfig.xFormat}`}
      yScale={{
        type: 'linear',
        // min: 'auto',
        // max: 'auto',
        stacked: false,
      }}
      axisLeft={{
        legendOffset: 12,
        tickPadding: 7,
        tickSize: 2,
        // tickRotation: -6,
      }}
      axisBottom={{
        format: currentConfig.axisBottomFormat,
        tickValues: currentConfig.tickValues,
        legendOffset: -6,
      }}
      enableGridX={false}
      enableGridY={false}
      enableArea={true}
      curve={currentConfig.curve}
      enablePointLabel={true}
      // pointSymbol={CustomSymbol}
      //   pointSize={16}
      //   pointBorderWidth={1}
      //   pointBorderColor={{
      //     from: 'color',
      //     modifiers: [['darker', 0.3]],
      //   }}
      useMesh={true}
      enableSlices={false}
      onClick={handleClickPoint}
    />
  );
};
