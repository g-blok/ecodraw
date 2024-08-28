import { Request, Response } from 'express';
const supabase = require('../database/supabaseClient');

const getCosts = async (req: Request, res: Response) => {
  try {
    const { data: costs, error } = await supabase
      .from('costs')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(costs);
  } catch (error) {
    console.error('Error fetching costs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { getCosts };
