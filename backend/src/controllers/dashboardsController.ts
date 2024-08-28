import { Request, Response } from 'express';
const supabase = require('../database/supabaseClient');

const getDashboards = async (req: Request, res: Response) => {
  try {
    const { data: dashboards, error } = await supabase
      .from('dashboards')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(dashboards);
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { getDashboards };
