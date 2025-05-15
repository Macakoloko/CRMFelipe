import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yuensysrmxqhzirqyuej.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1ZW5zeXNybXhxaHppcnF5dWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzgyMzUsImV4cCI6MjA1OTAxNDIzNX0.wqjmuhRKjvWJ7u0virPUGJk-kbf4oWwIC8MbUAjCWQU'

export const supabase = createClient(supabaseUrl, supabaseKey) 