
-- Add foreign key constraints for relationships between tables

-- Service requests table foreign keys
ALTER TABLE public.service_requests
ADD CONSTRAINT fk_service_requests_user
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE public.service_requests
ADD CONSTRAINT fk_service_requests_worker
FOREIGN KEY (worker_id) REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Products table foreign keys
ALTER TABLE public.products
ADD CONSTRAINT fk_products_seller
FOREIGN KEY (seller_id) REFERENCES auth.users(id)
ON DELETE CASCADE;
