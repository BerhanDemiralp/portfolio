import styles from "./ProjectCover.module.css";

const labels: Record<string, [string, string, string?]> = {
  "image-segmentation": ["VISION", "Beyond the pixels."],
  "coupon-recommendation": ["PREDICTION", "Worth the detour?"],
  iuchat: ["KNOWLEDGE", "Ask. Find. Understand."],
  "social-media-app": ["CONNECTION", "Make a moment."],
  "e-carbon": ["TRACEABILITY", "Every footprint counts."],
  "keep-in-touch": ["CARE", "A history of care."],
  naor: ["WORLDBUILDING", "Between realms."],
  "inventory-system": ["GAME SYSTEMS", "More than a slot."],
  "vertical-slice-architecture": ["ARCHITECTURE", "Built around a feature."],
};

function Artwork({ slug }: { slug: string }) {
  switch (slug) {
    case "image-segmentation": return <div className={styles.vision}><img src="/case-studies/segmentation-cover.png" alt="" loading="lazy" /><div className={styles.palette}>{["#612cdf", "#97d9dc", "#eac554", "#365d53", "#b197e7", "#d6dccf"].map(c => <i key={c} style={{background:c}} />)}</div></div>;
    case "iuchat": return <div className={styles.devices}><div className={styles.orbit} /><img className={styles.laptop} src="/iuchat/laptop.png" alt="" loading="lazy" /><img className={styles.phone} src="/iuchat/phone.png" alt="" loading="lazy" /></div>;
    case "keep-in-touch": return <div className={styles.care}><div className={styles.halo} /><img src="/case-studies/keep-in-touch-home.png" alt="" loading="lazy" /><img src="/case-studies/keep-in-touch-profile.png" alt="" loading="lazy" /></div>;
    case "coupon-recommendation": return <div className={styles.coupon}><svg viewBox="0 0 360 170"><path d="M-15 147C70 147 52 25 155 43S260 168 380 44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7"/><circle cx="155" cy="43" r="6" fill="currentColor"/><circle cx="309" cy="100" r="6" fill="currentColor"/></svg><div className={styles.ticket}><span>THE RIGHT OFFER</span><strong>Coffee on the way?</strong><div><span>Distance</span><span>Timing</span><span>Context</span></div><footer>ACCEPTANCE MODEL <b>↗</b></footer></div></div>;
    case "social-media-app": return <div className={styles.moment}><div className={styles.orbit}/><div className={styles.person}>A</div><div className={styles.person}>B</div><div className={styles.bubble}>A little time to connect.</div><div className={styles.reply}>Strengthen your relationships.</div></div>;
    case "e-carbon": return <div className={styles.carbon}><svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="57" fill="none" stroke="currentColor" strokeWidth="18" opacity=".13"/><path d="M75 18a57 57 0 1 1-54 75" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round"/><path d="M53 85c-7-24 12-37 43-39-2 31-15 48-39 42m0 0 28-28" fill="none" stroke="currentColor" strokeWidth="3"/></svg><div className={styles.receipt}><span>MONTHLY SNAPSHOT</span><strong>CO₂e</strong><i/><i/><i/><footer>✓ Frozen & traceable</footer></div></div>;
    case "naor": return <div className={styles.realm}><div className={styles.portal}/><svg viewBox="0 0 350 190"><path d="M0 190 52 94l38 47 41-25 40 74M350 190l-57-107-33 43-31-13-34 77" fill="currentColor" opacity=".26"/><path d="m162 143 13-96 13 96-13-8Zm-15 1h56m-28-8v29" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/></svg><span className={styles.realmName}>N A O R</span></div>;
    case "inventory-system": return <div className={styles.inventory}>{[0,1,2,3,4,5].map((i)=><div key={i} className={i===1?styles.activeSlot:""}>{i<3&&<svg viewBox="0 0 60 60">{i===0?<path d="M24 8h12v13l10 16v13H14V37l10-16ZM17 36h26M22 8h16"/>:i===1?<path d="m28 10 5-4 4 4-5 28-8-2Zm-11 24 23 6m-13-3-4 14"/>:<><circle cx="30" cy="35" r="15"/><path d="m30 20 5-9 8 3m0-8 4 3"/></>}</svg>}{i===1&&<span>✓</span>}</div>)}<aside>EQUIPPED / READY</aside></div>;
    default: return <div className={styles.slices}>{["Products", "Categories", "Feature flags"].map((v)=><div key={v}><strong>{v}</strong></div>)}<span className={styles.flag}>● enabled</span></div>;
  }
}

export default function ProjectCover({slug,className=""}:{slug:string;className?:string}) {
  const [label,title,footer]=labels[slug] || labels["vertical-slice-architecture"];
  return <div className={`${styles.cover} ${styles[slug] || ""} ${className}`} aria-hidden="true"><div className={styles.heading}><span>{label}</span><strong>{title}</strong></div><div className={styles.art}><Artwork slug={slug}/></div><div className={styles.caption}><span>{footer}</span><b>↗</b></div></div>;
}
