import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ogbajfiswhgbuwxjgdxl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYmFqZmlzd2hnYnV3eGpnZHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwMjE5MTQsImV4cCI6MjEwOTU5NzkxNH0.EdRHAFJ7RLK84EFjvIwIO6-qzmqeBVWG81GgrU9eotk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbOrder {
  id?: string;
  order_id: string;
  product_name: string;
  plan_duration?: string;
  amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  utr_number: string;
  payment_method?: string;
  status: 'pending_verification' | 'verified' | 'credentials_sent' | 'cancelled';
  created_at?: string;
  credentials_note?: string;
}

/**
 * Insert new order to Supabase
 */
export async function createOrderInSupabase(order: DbOrder): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          order_id: order.order_id,
          product_name: order.product_name,
          plan_duration: order.plan_duration || '',
          amount: order.amount,
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_email: order.customer_email,
          utr_number: order.utr_number,
          payment_method: order.payment_method || 'paytm',
          status: order.status || 'pending_verification',
        },
      ])
      .select();

    if (error) {
      console.warn('[Supabase] Insert order returned error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.warn('[Supabase] Exception in createOrderInSupabase:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Lookup order by Order ID or Phone number
 */
export async function lookupOrderInSupabase(query: string): Promise<DbOrder[]> {
  try {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // Check if query is order_id or phone
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .or(`order_id.ilike.%${trimmed}%,customer_phone.ilike.%${trimmed}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.warn('[Supabase] lookupOrder error:', error.message);
      return [];
    }

    return (data as DbOrder[]) || [];
  } catch (err) {
    console.warn('[Supabase] Exception in lookupOrder:', err);
    return [];
  }
}

/**
 * Fetch all recent orders for admin feed
 */
export async function fetchAllOrdersForAdmin(): Promise<DbOrder[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.warn('[Supabase] fetchAllOrders error:', error.message);
      return [];
    }
    return (data as DbOrder[]) || [];
  } catch (err) {
    console.warn('[Supabase] fetchAllOrders exception:', err);
    return [];
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: DbOrder['status']): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('order_id', orderId);

    if (error) {
      console.warn('[Supabase] updateOrderStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] updateOrderStatus exception:', err);
    return false;
  }
}

/**
 * Fetch products from Supabase (if table exists)
 */
export async function fetchProductsFromSupabase(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      // Table might not exist yet, fallback gracefully
      return null;
    }
    return data || [];
  } catch {
    return null;
  }
}

/**
 * Upsert product in Supabase
 */
export async function upsertProductInSupabase(prod: any): Promise<boolean> {
  try {
    const row = {
      id: prod.id,
      name: prod.name,
      category: prod.category || 'OTT',
      tagline: prod.tagline || '',
      description: prod.description || '',
      image: prod.image,
      popular: !!prod.popular,
      delivery_type: prod.deliveryType,
      devices: prod.devices,
      features: prod.features || [],
      plans: prod.plans || [],
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('[Supabase] upsertProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] upsertProduct exception:', err);
    return false;
  }
}

/**
 * Delete product from Supabase
 */
export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.warn('[Supabase] deleteProduct error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] deleteProduct exception:', err);
    return false;
  }
}


