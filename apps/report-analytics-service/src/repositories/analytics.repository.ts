import { Op } from 'sequelize';
import { AnalyticsDaily } from '../models/analyticsDailyMetric.model';

export const findTodayCounters = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return AnalyticsDaily.findOne({
    where: {
      date: today,
    },
  });
};

export const findAppointmentTrend = async () => {
  const setSevenDaysAgo = new Date();
  setSevenDaysAgo.setDate(setSevenDaysAgo.getDate() - 7);

  return AnalyticsDaily.findAll({
    where: {
      date: {
        [Op.gte]: setSevenDaysAgo,
      },
    },
    order: [['date', 'ASC']],
  });
};

// export const findStatusDistribution = async() => {
//      const today = new Date();
//     today.setHours(0,0,0,0);

//     return AnalyticsDaily.findOne({
//         where: {
//             date:today
//         }
//     });

// }

export const findDailyAnalytics = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  return AnalyticsDaily.findAndCountAll({
    limit,
    offset,
    order: [['date', 'DESC']],
  });
};
