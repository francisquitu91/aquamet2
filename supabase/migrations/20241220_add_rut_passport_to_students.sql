-- Add rut_passport column to students table
-- This column will store Chilean RUT numbers or passport numbers for student identification

ALTER TABLE students 
ADD COLUMN rut_passport TEXT;

-- Add a comment to the column for documentation
COMMENT ON COLUMN students.rut_passport IS 'Student identification: Chilean RUT or passport number';

-- Add an index for better query performance (optional)
CREATE INDEX IF NOT EXISTS idx_students_rut_passport 
ON students USING btree (rut_passport);

-- Update existing students with sample data (optional - for testing)
-- This will add Chilean RUT format numbers to existing students
-- You can modify or remove this section if you prefer to add RUTs manually

DO $$
DECLARE
    student_record RECORD;
    rut_number INT;
    verification_digit CHAR(1);
BEGIN
    FOR student_record IN 
        SELECT id FROM students WHERE rut_passport IS NULL
    LOOP
        -- Generate a random RUT number between 10,000,000 and 25,000,000
        rut_number := 10000000 + floor(random() * 15000000)::int;
        
        -- Calculate verification digit using simplified algorithm
        verification_digit := (CASE 
            WHEN (rut_number % 11) = 0 THEN 'K'
            WHEN (rut_number % 11) = 1 THEN '0'
            ELSE ((11 - (rut_number % 11)) % 10)::CHAR(1)
        END);
        
        -- Format as Chilean RUT: XX.XXX.XXX-Y
        UPDATE students 
        SET rut_passport = 
            SUBSTRING(rut_number::TEXT FROM 1 FOR LENGTH(rut_number::TEXT)-6) || '.' ||
            SUBSTRING(rut_number::TEXT FROM LENGTH(rut_number::TEXT)-5 FOR 3) || '.' ||
            SUBSTRING(rut_number::TEXT FROM LENGTH(rut_number::TEXT)-2) || '-' ||
            verification_digit
        WHERE id = student_record.id;
    END LOOP;
END $$;
