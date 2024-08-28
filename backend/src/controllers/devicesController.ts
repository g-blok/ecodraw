import { Request, Response } from 'express';
const supabase = require('../database/supabaseClient');

const getDevices = async (req: Request, res: Response) => {
  try {
    const { data: devices, error } = await supabase
      .from('devices')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default { getDevices };
