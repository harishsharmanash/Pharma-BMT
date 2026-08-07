#!/usr/bin/env python3
"""Generate demo bill PDFs and visiting cards in stress-test-assets/."""
import os, random
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as pdfcanvas

OUT = "/Users/harishsharma/Claude/Pharma BMT/stress-test-assets"
os.makedirs(OUT, exist_ok=True)
random.seed(42)

PRODUCTS = [
    ("Azithral 500 Tab","Azithromycin 500mg","3 Tab","AZ%d",119.00,85.00),
    ("Dolo 650 Tab","Paracetamol 650mg","15 Tab","DL%d",32.50,24.00),
    ("Pan 40 Tab","Pantoprazole 40mg","10x10","PN%d",1400.00,980.00),
    ("Augmentin 625 Duo","Amoxy 500 + Clav 125","10 Tab","AU%d",223.00,168.00),
    ("Cetriz 10 Tab","Cetirizine 10mg","10x10","CT%d",55.00,38.00),
    ("Zerodol-P Tab","Aceclofenac + Para","10x10","ZD%d",120.00,82.00),
    ("Omez 20 Cap","Omeprazole 20mg","20x10","OM%d",98.00,66.00),
    ("Benadryl Syp 100ml","Diphenhydramine","100ml","BN%d",110.00,78.00),
    ("Volini Gel 30g","Diclofenac Gel","30g","VL%d",135.00,95.00),
    ("Electral Powder","WHO ORS","21.8g","EL%d",22.00,15.50),
    ("Sinarest Tab","PCP + CPM + Para","10x10","SN%d",45.00,31.00),
    ("Dexorange Syp 200ml","Iron + Folic","200ml","DX%d",185.00,132.00),
]
GST = 12.0

def rows(n):
    picks = random.sample(PRODUCTS, n)
    out = []
    for name, comp, pack, bfmt, mrp, rate in picks:
        qty = random.choice([10,20,25,50,100,200])
        batch = bfmt % random.randint(100,999)
        exp = f"{random.choice(['01','04','06','09','11'])}/202{random.choice(['6','7','8'])}"
        amt = round(qty*rate,2)
        out.append((name, comp, pack, batch, exp, qty, mrp, rate, amt))
    return out

def draw_bill(fn, dist, addr, gstin, nrows, messy=False, annotation=None, credit=False):
    path = os.path.join(OUT, fn)
    c = pdfcanvas.Canvas(path, pagesize=A4)
    W,H = A4
    y = H-25*mm
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(W/2, y, ("CREDIT NOTE" if credit else "TAX INVOICE")); y -= 8*mm
    c.setFont("Helvetica-Bold", 12); c.drawString(20*mm, y, dist); y -= 6*mm
    c.setFont("Helvetica", 9); c.drawString(20*mm, y, addr); y -= 5*mm
    c.drawString(20*mm, y, f"GSTIN: {gstin}   DL No: 20B/{random.randint(1000,9999)}"); y -= 5*mm
    invno = f"INV-{random.randint(2000,2999)}"
    c.drawString(20*mm, y, f"{'CN No' if credit else 'Invoice No'}: {invno}   Date: 14/07/2026"); y -= 8*mm
    if annotation:
        c.setFont("Helvetica-Oblique", 9)
        c.drawString(20*mm, y, f"Note (handwritten): {annotation}"); y -= 7*mm
        c.setFont("Helvetica", 9)
    headers = ["#","Product","Pack","Batch","Exp","Qty","MRP","Rate","Amount"]
    xs = [20*mm, 27*mm, 82*mm, 100*mm, 120*mm, 140*mm, 155*mm, 172*mm, 188*mm]
    c.setFont("Helvetica-Bold", 9)
    for x,h in zip(xs,headers): c.drawString(x, y, h)
    y -= 2*mm; c.line(20*mm, y, 205*mm, y); y -= 5*mm
    c.setFont("Helvetica", 8.5)
    total = 0
    for i,(name,comp,pack,batch,exp,qty,mrp,rate,amt) in enumerate(rows(nrows),1):
        jitter = random.uniform(-1.2,1.2)*mm if messy else 0
        vals = [str(i), name + ("  ("+comp+")" if i%3==0 else ""), pack, batch, exp, str(qty), f"{mrp:.2f}", f"{rate:.2f}", f"{amt:.2f}"]
        for x,v in zip(xs,vals): c.drawString(x+jitter, y+(random.uniform(-1,1)*mm if messy else 0), v)
        total += amt; y -= 5.5*mm
    y -= 2*mm; c.line(20*mm, y, 205*mm, y); y -= 6*mm
    gst = round(total*GST/100,2)
    sign = -1 if credit else 1
    c.setFont("Helvetica", 10)
    c.drawRightString(200*mm, y, f"Subtotal: {total:.2f}"); y -= 5*mm
    c.drawRightString(200*mm, y, f"GST @12%: {gst:.2f}"); y -= 5*mm
    c.setFont("Helvetica-Bold", 11)
    c.drawRightString(200*mm, y, f"Grand Total: {abs(sign*(total+gst)):.2f}")
    if credit:
        y -= 7*mm; c.setFont("Helvetica-Oblique", 9)
        c.drawString(20*mm, y, "Being credit for goods returned / rate difference. Adjust against future invoices.")
    c.setFont("Helvetica", 8); c.drawString(20*mm, 15*mm, "E&OE. Goods once sold will not be taken back. Subject to local jurisdiction.")
    c.showPage(); c.save()
    return path

bills = [
    ("bill_krishna_traders.pdf","KRISHNA TRADERS","Shop 4, Grain Market, Karnal - 132001 (Haryana)","06AAKFK1234A1Z5",5,{}),
    ("bill_shree_balaji_distributors.pdf","SHREE BALAJI DISTRIBUTORS","Plot 22, Industrial Area Phase II, Panipat - 132103","06ABPFS2211B1Z3",8,{}),
    ("bill_om_sai_medicos_messy.pdf","OM SAI MEDICOS","Main Bazar, Jind - 126102","06AAHFO8899C1Z1",6,{"messy":True}),
    ("bill_new_sharma_traders_annotated.pdf","NEW SHARMA TRADERS","Opp. Civil Hospital, Kurukshetra - 136118","06AACFS4422D1Z9",7,{"annotation":"50 strips Dolo free scheme, batch check kar lena - Ramesh"}),
    ("bill_punjab_drug_house.pdf","PUNJAB DRUG HOUSE","12, Mall Road, Ludhiana - 141001 (Punjab)","03AAXFP7788E1Z2",12,{}),
    ("bill_shree_ganesh_distributors.pdf","SHREE GANESH DISTRIBUTORS","Sector 12 Market, Hisar - 125001","06ABZFS9900F1Z7",4,{}),
    ("credit_note_maakali_agencies.pdf","MAA KALI AGENCIES","G.T. Road, Ambala Cantt - 133001","06AAQFM5566G1Z4",3,{"credit":True}),
]
for fn,dist,addr,gstin,n,kw in bills:
    p = draw_bill(fn,dist,addr,gstin,n,**kw)
    print(fn, os.path.getsize(p))

def draw_card(fn, name, desig, firm, phone, addr):
    path = os.path.join(OUT, fn)
    c = pdfcanvas.Canvas(path, pagesize=(95*mm, 55*mm))
    W,H = 95*mm, 55*mm
    c.setFillGray(0.12); c.rect(0, H-14*mm, W, 14*mm, stroke=0, fill=1)
    c.setFillGray(1); c.setFont("Helvetica-Bold", 13); c.drawCentredString(W/2, H-10*mm, firm)
    c.setFillGray(0); c.setFont("Helvetica-Bold", 11); c.drawCentredString(W/2, H-22*mm, name)
    c.setFont("Helvetica-Oblique", 8); c.drawCentredString(W/2, H-27*mm, desig)
    c.setFont("Helvetica", 8.5)
    c.drawCentredString(W/2, H-34*mm, f"Mob: {phone}")
    c.drawCentredString(W/2, H-39*mm, addr)
    c.setFont("Helvetica", 7); c.drawCentredString(W/2, 5*mm, "All types of pharma PCD, generic & ethical range")
    c.showPage(); c.save()
    print(fn, os.path.getsize(path))

draw_card("card_dr_rajesh_mehta.pdf","Dr. Rajesh Mehta","Proprietor","MEHTA MEDICAL AGENCIES","+91 98120 44332","Shop 7, New Grain Market, Karnal (HR)")
draw_card("card_gupta_medicos.pdf","Suresh Gupta","Owner","GUPTA MEDICOS","94161 27890","12-A, Model Town, Panipat, Haryana")
print("done")
