from worker.tasks.process_pending import process_pending_images

def main():
    print("[Worker] Starting worker...")
    process_pending_images()

if __name__ == "__main__":
    main()