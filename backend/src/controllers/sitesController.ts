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

const updateSite = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_date: Math.floor(Date.now() / 1000),
    };

    try {
      const { data: site, error } = await supabase
        .from('sites')
        .update(updateData)
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

const createSite = async (req: Request, res: Response) => {
    const newSite = {
      ...req.body,
      created_date: Math.floor(Date.now() / 1000),
      updated_date: Math.floor(Date.now() / 1000),
    };

    try {
      const { data: site, error } = await supabase
        .from('sites')
        .insert(newSite)
        .single();
  
      if (error) {
        throw error;
      }

      res.json(site);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default { getSites, updateSite, createSite };
