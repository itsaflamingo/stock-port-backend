import { Router, Request, Response } from 'express';
import supabase from '../utils/supabase';

const router = Router();

router.get('/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('positions')
      .select('*')
      .limit(1);

    console.log('🧪 Supabase object:', supabase);


    if (error) {
      console.error('Supabase error:', error.message);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;