import { Request, Response } from 'express';
const supabase = require('../database/supabaseClient');

const getSites = async (req: Request, res: Response) => {
    console.log('ran getSites')

    try {
        const { data: sites, error } = await supabase
        .from('sites')
        .select('*');

        if (error) {
        throw error;
        }

        res.json(sites);
    } catch (error) {
        console.error('Error fetching sites:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateSiteLayout = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { layout } = req.body;
  
    console.log('new layout: ', layout)
    console.log('ran updateSiteLayout')

    try {
      // Fetch the chart's SQL query using Supabase
      const { data: site, error } = await supabase
        .from('sites')
        .update({ layout: layout })
        .eq('id', id);
  
      if (error) {
        throw error;
      }

  
      res.json(site);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default { getSites, updateSiteLayout };
