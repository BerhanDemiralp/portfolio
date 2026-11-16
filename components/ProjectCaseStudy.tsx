"use client";

import Image from "next/image";

import { useState } from "react";
import type { Project } from "@/lib/projects";
import { caseStudies } from "@/lib/case-studies";
import styles from "./ProjectCaseStudy.module.css";

const comparison = [
  { name: "Majority baseline", auc: 0.5, f1: 0.724851 },
  { name: "Logistic Regression", auc: 0.735236, f1: 0.733195 },
  { name: "Calibrated LinearSVC", auc: 0.735511, f1: 0.734431 },
  { name: "Random Forest", auc: 0.82762, f1: 0.795958 },
  { name: "Tuned Random Forest", auc: 0.833535, f1: 0.79994 },
];

function CouponVisual() {
  const [metric, setMetric] = useState<"auc" | "f1">("auc");
  return <figure className={styles.visual}>
    <div className={styles.visualHeading}><h4>Which model earns the next experiment?</h4><div className={styles.controls} aria-label="Comparison metric">
      <button type="button" aria-pressed={metric === "auc"} onClick={() => setMetric("auc")}>ROC-AUC</button>
      <button type="button" aria-pressed={metric === "f1"} onClick={() => setMetric("f1")}>F1</button>
    </div></div>
    <div className={styles.bars}>{comparison.map(row => <div key={row.name}>
      <div className={styles.barLabel}><span>{row.name}</span><strong>{row[metric].toFixed(4)}</strong></div>
      <div className={styles.track}><span style={{ width: `${row[metric] * 100}%` }} /></div>
    </div>)}</div>
    <div className={styles.scale}><span>0.0</span><span>1.0</span></div>
    <figcaption>Saved notebook results · five-fold cross-validation on training data. Tuned-model scores reuse the search folds; they are not an independent test.</figcaption>
    <div className={styles.metrics}><div><strong>0.8035</strong><span>Final test F1</span></div><div><strong>0.8288</strong><span>Final test ROC-AUC</span></div><div><strong>0.4342</strong><span>Selected threshold</span></div></div>
  </figure>;
}

function SegmentationVisual() {
  const classes = [["Building", "#3C1098"], ["Land", "#8429F6"], ["Road", "#6EC1E4"], ["Vegetation", "#FEDD3A"], ["Water", "#E2A929"], ["Unlabeled", "#9B9B9B"]];
  const patchClasses = [0, 1, 2, 1, 3, 2, 4, 4, 5];
  return <><figure className={styles.visual}>
    <h4>From color to class</h4>
    <div className={styles.segmentation}>
      <div className={styles.patchGrid} role="img" aria-label="Nine example patches colored by segmentation class">
        {patchClasses.map((classIndex, index) => (
          <span key={index} style={{ backgroundColor: classes[classIndex][1] }}>
            {index === 4 ? "256²" : ""}
          </span>
        ))}
      </div>
      <span className={styles.arrow} aria-hidden="true">→</span>
      <div className={styles.palette}>
        {classes.map(([name, color], index) => (
          <div key={name}><i style={{ background: color }} /><span>{name}</span><code>{index}</code></div>
        ))}
      </div>
    </div>
  </figure><figure className={styles.visual}>
    <h4>Prediction Example</h4>
    <a href="/case-studies/segmentation-internship-prediction.jpg" target="_blank" rel="noreferrer" aria-label="Open the satellite image, reference mask and prediction comparison at full size">
      <img className={styles.output} src="/case-studies/segmentation-internship-prediction.jpg" width="1950" height="649" alt="Satellite image 1095 alongside its reference mask and later U-Net prediction, showing buildings, a road, vegetation and water." loading="lazy" />
    </a>
    <figcaption>Satellite image, reference mask and U-Net prediction.</figcaption>
  </figure></>;
}

function SegmentationExperiments() {
  return <section className={styles.experiments}>
    <span className="eyebrow">EXPERIMENTS & FINDINGS</span>
    <h3>Following the experiments beyond the first prediction</h3>
    <figure className={styles.visual}>
      <h4>Tracking training and validation together</h4>
      <p>The 40-epoch run shows both losses decreasing, with fluctuations in validation loss. The curve helped track training.</p>
      <a href="/case-studies/segmentation-internship-loss.jpg" target="_blank" rel="noreferrer" aria-label="Open the training and validation loss chart at full size"><img className={styles.output} src="/case-studies/segmentation-internship-loss.jpg" width="1424" height="828" alt="Training and validation loss curves over 40 epochs; the screenshot reports final training loss 0.5254 and validation loss 0.5403." loading="lazy" /></a>
    </figure>
    <figure className={styles.visual}>
      <h4>Combining several views of the same image</h4>
      <p>Blurred and flipped inputs produce separate predictions. After restoring their orientation, a pixel-wise class vote combines them. Comparing the combined mask with the original prediction made the effect visible without assuming it was an improvement.</p>
      <a href="/case-studies/segmentation-internship-tta.jpg" target="_blank" rel="noreferrer" aria-label="Open the test-time augmentation comparison at full size"><img className={styles.output} src="/case-studies/segmentation-internship-tta.jpg" width="980" height="827" alt="Six-panel experiment showing Gaussian blur, horizontal flip, vertical flip, original prediction, mixed augmented prediction and original satellite image." loading="lazy" /></a>
      <figcaption>Gaussian blur, horizontal and vertical flips, and the combined prediction. TTA did not improve accuracy in this experiment.</figcaption>
    </figure>
  </section>;
}

function CarbonVisual() {
  return <figure className={styles.visual}>
    <h4>The calculation stays attached to its evidence</h4>
    <div className={styles.equation}><div><small>Activity</small><strong>Quantity</strong></div><b>×</b><div><small>Copied into snapshot</small><strong>Factor</strong></div><b>=</b><div><small>Recorded result</small><strong>kg CO₂e</strong></div></div>
  </figure>;
}

function CareVisual() {
  return <div className={styles.appScreens}>
    <figure>
      <a href="/case-studies/keep-in-touch-home.png" target="_blank" rel="noreferrer" aria-label="Open the KeepInTouch home screen at full size"><img src="/case-studies/keep-in-touch-home.png" width="367" height="792" alt="KeepInTouch home screen with an animal list, form filters and badges for unchecked or reviewed forms." loading="lazy" /></a>
      <figcaption><h4>See what needs attention</h4><p>The home screen brings animal records together, with filters and review-status badges that make outstanding forms easy to spot.</p></figcaption>
    </figure>
    <figure>
      <a href="/case-studies/keep-in-touch-profile.png" target="_blank" rel="noreferrer" aria-label="Open the KeepInTouch animal profile at full size"><img src="/case-studies/keep-in-touch-profile.png" width="299" height="650" alt="Şeker's animal profile showing species, age, owner information and routine check and vaccination forms with their review states." loading="lazy" /></a>
      <figcaption><h4>A care history in one place</h4><p>The profile connects animal and owner details with dated visit forms, distinguishing pending, awaiting-review and reviewed entries.</p></figcaption>
    </figure>
  </div>;
}

const flagFeatures = [
  { id: "browse", label: "Browse products" },
  { id: "create", label: "Create a product" },
  { id: "categories", label: "Manage categories" },
] as const;

const initialFlags = {
  Admin: { browse: true, create: true, categories: true },
  CustomerA: { browse: true, create: true, categories: false },
  CustomerB: { browse: true, create: false, categories: false },
};
type DemoUser = keyof typeof initialFlags;
const demoUsers: DemoUser[] = ["Admin", "CustomerA", "CustomerB"];

function FlagVisual() {
  const [user, setUser] = useState<DemoUser>("CustomerA");
  const [flags, setFlags] = useState(initialFlags);

  return (
    <figure className={styles.visual}>
      <h4>Feature flag playground</h4>
      <p>Choose a user type, then toggle its flags to update the feature preview.</p>
      <div className={`${styles.controls} ${styles.flagUsers}`} role="group" aria-label="User type">
        {demoUsers.map((name) => (
          <button key={name} type="button" aria-pressed={user === name} onClick={() => setUser(name)}>
            {name}
          </button>
        ))}
      </div>
      <div className={styles.flagDemo}>
        <div className={styles.flagPanel}>
          <h5>Flags for {user}</h5>
          {flagFeatures.map(({ id, label }) => (
            <label key={id} className={styles.flagOption}>
              {label}
              <input type="checkbox" role="switch" checked={flags[user][id]} onChange={(event) => {
                const enabled = event.currentTarget.checked;
                setFlags((current) => ({ ...current, [user]: { ...current[user], [id]: enabled } }));
              }} />
            </label>
          ))}
        </div>
        <div className={styles.flagOverview} aria-live="polite">
          {demoUsers.map((name) => (
            <div className={styles.flagUserCard} key={name} data-selected={user === name}>
              <h5>{name}</h5>
              <ul>
                {flagFeatures.map(({ id, label }) => (
                  <li key={id} data-enabled={flags[name][id]}>
                    <span aria-hidden="true">{flags[name][id] ? "✓" : "–"}</span>
                    {label}
                    <small>{flags[name][id] ? "On" : "Off"}</small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

function InventoryVisual() {
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("One item in the stack.");
  function add() { if (quantity >= 3) { setNotice("Stack limit reached. No item added."); return; } setQuantity(quantity + 1); setNotice("Item added to the existing stack."); }
  function use() { if (quantity === 0) { setNotice("The slot is empty."); return; } setQuantity(quantity - 1); setNotice(quantity === 1 ? "Last item used. The slot is now empty." : "Item used. Stack reduced by one."); }
  return <figure className={styles.visual}>
    <h4>The rule behind the slot</h4><div className={styles.inventoryLayout}><div className={styles.slots} aria-label={`Illustrative inventory, ${quantity} items in the first slot`}>{Array.from({ length: 6 }, (_, i) => <div key={i}>{i === 0 && quantity > 0 && <><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 5h12v9l9 15v10H9V29l9-15Z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M11 29h26v8H11Z" fill="currentColor"/><path d="M17 5h14" stroke="currentColor" strokeWidth="4"/></svg><span>×{quantity}</span></>}</div>)}</div><div><span className={styles.terminalLabel}>STACK CAPACITY / 3</span><p>Add to the stack or use an item to see how a slot changes.</p><div className={styles.controls}><button type="button" onClick={add}>Add item</button><button type="button" onClick={use}>Use item</button><button type="button" onClick={() => { setQuantity(1); setNotice("One item in the stack."); }}>Reset</button></div><p className={styles.notice} role="status">{notice}</p></div></div>
    <figcaption>Simplified browser demonstration of stacking and an empty slot. The Unity implementation also checks shop stock, equipment and category capacity.</figcaption>
  </figure>;
}

function NaorVisual() {
  return <figure className={styles.visual}>
    <img className={styles.gameArt} src="/case-studies/naor-capsule.png" alt="NAOR: The Nine Aspect of Realms game artwork by the OTK team." loading="lazy" />
    <div className={styles.contributions}><div><span>NAOR-60</span><h4>Inventory & equipment</h4><p>Stack fixes, selection and UI integration</p></div><div><span>NAOR-80</span><h4>Bomb mechanics</h4><p>Normal, wind and slow-down bomb work</p></div><div><span>NAOR-84</span><h4>Daggers & feedback</h4><p>Dagger integration and interface follow-up</p></div></div>
  </figure>;
}

function IuchatDemo() {
  return <div className={styles.demos} id="iuchat-demo">
    <figure className={styles.figure}>
      <video controls playsInline preload="none" poster="/iuchat/ask-a-question.jpg" aria-label="IUCHAT demo">
        <source src="/iuchat/ask-a-question.mp4" type="video/mp4" />
        <a href="/iuchat/ask-a-question.mp4">Open the demo clip</a>
      </video>
    </figure>
  </div>;
}

function IuchatArchitecture() {
  return (<details className={styles.architecture}>
          <summary>Follow the hybrid retrieval pipeline</summary>
          <figure className={styles.figure}>
            <Image
              src="/iuchat/hybrid-retrieval.jpg"
              width={1257}
              height={943}
              sizes="(max-width: 700px) 100vw, 1000px"
              unoptimized
              alt="IUCHAT architecture showing query enrichment, embedding, Supabase vector and Turkish keyword search, rank fusion, and Gemini answer generation."
            />
            <figcaption>From query enrichment to vector and keyword retrieval, rank fusion and answer generation.</figcaption>
          </figure></details>);
}

const metrics = [
  { label: "Answer accuracy", value: 92, description: "Correct and sufficient answers" },
  { label: "Recall@3", value: 93, description: "Coverage of relevant passages in the first three results" },
  { label: "Hit rate", value: 95, description: "Questions with at least one relevant passage retrieved" },
  { label: "Incomplete or hallucinated answers", value: 3, description: "Answers flagged in the project evaluation" },
];

function IuchatEvaluation() {
  return (
    <figure className={styles.figure}>
      <div className={styles.chart}>
        {metrics.map(({ label, value, description }) => (
          <div key={label} className={styles.metric}>
            <div className={styles.metricLabel}>
              <strong>{label}</strong>
              <span>{value}%</span>
            </div>
            <div className={styles.evaluationTrack} aria-hidden="true">
              <span style={{ width: `${value}%` }} />
            </div>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function ProjectVisual({ slug }: { slug: string }) {
  switch (slug) {
    case "iuchat": return <IuchatDemo />;
    case "coupon-recommendation": return <CouponVisual />;
    case "image-segmentation": return <SegmentationVisual />;
    case "e-carbon": return <CarbonVisual />;
    case "keep-in-touch": return <CareVisual />;
    case "vertical-slice-architecture": return <FlagVisual />;
    case "inventory-system": return <InventoryVisual />;
    case "naor": return <NaorVisual />;
    default: return null;
  }
}

export default function ProjectCaseStudy({ project }: { project: Project }) {
  const study = caseStudies[project.slug];
  if (!study) return null;
  return <div className={styles.study}>
    <section className={styles.intro}><span className="eyebrow"></span><h3>{study.title}</h3><p>{study.introduction}</p></section>
    <section><span className="eyebrow"></span><h3>{study.focus}</h3><ol className={styles.steps}>{study.steps.map((step, i) => <li key={step.title}><span>0{i + 1}</span><h4>{step.title}</h4><p>{step.text}</p></li>)}</ol><ProjectVisual slug={project.slug} /></section>
    <section><span className="eyebrow"></span><h3>{study.engineeringTitle ?? "What sits behind the experience"}</h3>{study.engineeringIntro && <p>{study.engineeringIntro}</p>}<div className={styles.decisions}>{study.decisions.map((decision, i) => <div key={decision.title}><span className={styles.decisionNumber}>0{i + 1}</span><div><h4>{decision.title}</h4><p>{decision.text}</p></div></div>)}</div>{project.slug === "iuchat" && <IuchatArchitecture />}</section>
    {project.slug === "image-segmentation" && <SegmentationExperiments />}
    <section className={study.resultIntro ? undefined : styles.outcome}>
      <span className="eyebrow"></span>
      <h3>{study.resultTitle ?? "What the project demonstrates"}</h3>
      {study.resultIntro && <p>{study.resultIntro}</p>}
      {project.slug === "iuchat" && <IuchatEvaluation />}
      <p className={study.resultIntro ? `${styles.outcome} ${styles.evaluationOutcome}` : undefined}>{study.outcome}</p>
    </section>
    <section><span className="eyebrow"></span><h3>What I take forward</h3><dl className={styles.lessons}>{study.lessons.map(lesson => <div key={lesson.title}><dt>{lesson.title}</dt><dd>{lesson.text}</dd></div>)}</dl></section>
  </div>;
}
