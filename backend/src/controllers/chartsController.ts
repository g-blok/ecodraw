import { log } from 'console';
import { Request, Response } from 'express';
const supabase = require('../database/supabaseClient');

const getCharts = async (req: Request, res: Response) => {
  try {
    // Fetch all charts from Supabase
    const { data: charts, error } = await supabase
      .from('charts')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(charts);
  } catch (error) {
    console.error('Error fetching charts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getChartData = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // Fetch the chart's SQL query using Supabase
    const { data: charts, error } = await supabase
      .from('charts')
      .select(`sql_query, date_field_field`)
      .eq('id', id);

    if (error) {
      throw error;
    }

    if (charts.length === 0) {
      return res.status(404).json({ error: 'Chart not found' });
    }

    const chart = charts[0];
    let dataQuery = chart.sql_query;
    if (chart.date_field_field && startDate && endDate) {
      function addConditionToSQL(query: string, condition: string): string {
        const splitQuery = query.split(/(group by)/i);
        if (splitQuery.length < 3) {
          return  `${query} ${timeCondition}`;
        }
        const modifiedQuery = `${splitQuery[0].trim()} ${condition} ${splitQuery[1]} ${splitQuery[2].trim()}`;
        return modifiedQuery;
      }     
 
      const timeCondition = `WHERE ${chart.date_field_field} BETWEEN '${startDate}' AND '${endDate}'`;
      dataQuery = addConditionToSQL(dataQuery, timeCondition);
    } 

    const { data: results, error: queryError } = await supabase.rpc('execute_sql', {
      query: dataQuery,
    });

    if (queryError) {
      throw queryError;
    }

    res.json(results);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { getCharts, getChartData };
