import os
import sys
import shutil
import time

# Ensure current directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from styles import init_document
from front_matter import build_front_matter
from chapter1 import build_chapter_1
from chapter2 import build_chapter_2
from chapter3 import build_chapter_3
from chapter4 import build_chapter_4
from chapter5 import build_chapter_5
from chapter6 import build_chapter_6
from chapter7 import build_chapter_7
from chapter8_and_appendices import build_chapter_8_and_appendices

def compile_master_report():
    print("=================================================================")
    print("  BOOKING OMNI QUEUE (BOOKING OQ) - MASTER REPORT COMPILER")
    print("  Target: ~140 Pages Formal Academic Dissertation")
    print("=================================================================")
    start_time = time.time()

    doc = init_document()

    print("[1/9] Building Front Matter (Cover, Certificates, TOC, LOF, LOT, Acronyms)...")
    build_front_matter(doc)

    print("[2/9] Building Chapter 1: Introduction, Problem Formulation & Queueing Domain...")
    build_chapter_1(doc)

    print("[3/9] Building Chapter 2: Systems Engineering Methodology & SDLC...")
    build_chapter_2(doc)

    print("[4/9] Building Chapter 3: System Architecture, Structural Modeling & Mathematics...")
    build_chapter_3(doc)

    print("[5/9] Building Chapter 4: Implementation & Deep Codebase Walkthrough...")
    build_chapter_4(doc)

    print("[6/9] Building Chapter 5: Verification, Validation & Empirical Testing...")
    build_chapter_5(doc)

    print("[7/9] Building Chapter 6: Operations, Site Reliability Engineering & Postmortems...")
    build_chapter_6(doc)

    print("[8/9] Building Chapter 7: Comparative Analysis, Conclusion & Future Roadmap...")
    build_chapter_7(doc)

    print("[9/9] Building Chapter 8 & Appendices A to J (DBML, Proofs, Benchmarks, Glossary)...")
    build_chapter_8_and_appendices(doc)

    output_path = r"C:\Desktop\Booking OQ\Booking_OmniQueue_Master_Project_Report.docx"
    print(f"Saving compiled master document to: {output_path}...")
    doc.save(output_path)

    # Mirror to required user locations
    mirrors = [
        r"C:\Desktop\NEW PROJECT\Booking_OmniQueue_Master_Project_Report.docx",
        r"C:\Desktop\Booking_OmniQueue_Master_Project_Report.docx",
        r"C:\Users\jai18\Downloads\Booking_OmniQueue_Master_Project_Report.docx"
    ]
    for m in mirrors:
        try:
            shutil.copyfile(output_path, m)
            print(f"Successfully mirrored document to: {m}")
        except Exception as e:
            print(f"Warning: Could not mirror to {m}: {e}")

    elapsed = time.time() - start_time
    print(f"Report generation completed in {elapsed:.2f} seconds!")

if __name__ == "__main__":
    compile_master_report()
