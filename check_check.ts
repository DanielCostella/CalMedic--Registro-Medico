
import { supabase } from './src/lib/supabase';

async function checkAppointments() {
    console.log('Checking appointments in database...');
    
    const { data, error } = await supabase
        .from('appointments')
        .select(`
            id,
            date,
            time,
            patient_name,
            doctor_id,
            created_at
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log(`Found ${data.length} appointments:`);
    console.table(data);
}

checkAppointments();
