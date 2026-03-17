import { useEffect, useMemo, useState, type CSSProperties } from "react";

const portals = [
  {
    id: "blog",
    label: "博客",
    title: "花签与慢写",
    href: "https://example.com/blog",
    domain: "your-blog.example",
    description: "把随记、照片、观影碎片和一些夜里的心情，安静地收进一册纸页里。",
    accent: "#bc6b8a",
    glaze: "rgba(245, 205, 220, 0.78)",
  },
  {
    id: "social",
    label: "社媒",
    title: "春夜的会客间",
    href: "https://example.com/social",
    domain: "social.example.com",
    description: "更即时一点的日常、片刻灵感、偶尔冒出来的分享欲，也会在这里亮灯。",
    accent: "#a95f75",
    glaze: "rgba(237, 197, 212, 0.8)",
  },
  {
    id: "github",
    label: "GitHub",
    title: "代码与小小机关",
    href: "https://github.com/your-id",
    domain: "github.com/your-id",
    description: "把想法做成能运转的东西，留下一点结构、习惯和克制的浪漫。",
    accent: "#865263",
    glaze: "rgba(222, 195, 205, 0.82)",
  },
] as const;

const scenes = [
  { id: "preface", name: "序章", index: "01" },
  { id: "passages", name: "签页", index: "02" },
  { id: "garden", name: "庭末", index: "03" },
] as const;

function PortalIcon({ id }: { id: (typeof portals)[number]["id"] }) {
  if (id === "blog") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10">
        <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z" />
        <path d="M14 3.5V8h4" />
        <path d="M9 12h6" />
        <path d="M9 15.5h6" />
      </svg>
    );
  }

  if (id === "social") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10">
        <path d="M6.5 6.5h11A2.5 2.5 0 0 1 20 9v6a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3v-3H6.5A2.5 2.5 0 0 1 4 15V9a2.5 2.5 0 0 1 2.5-2.5Z" />
        <path d="M8 10.5h8" />
        <path d="M8 13.5h5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-10 w-10">
      <path d="M12 3.75c-4.56 0-8.25 3.72-8.25 8.3 0 3.66 2.35 6.76 5.61 7.86.42.08.57-.18.57-.41 0-.2-.01-.86-.01-1.56-2.06.38-2.6-.5-2.77-.96-.09-.23-.46-.95-.79-1.14-.27-.15-.66-.53-.01-.54.61-.01 1.04.56 1.18.79.7 1.18 1.81.85 2.25.65.07-.51.27-.85.49-1.05-1.83-.21-3.74-.92-3.74-4.08 0-.9.32-1.64.85-2.22-.08-.21-.37-1.07.08-2.22 0 0 .69-.22 2.27.85a7.61 7.61 0 0 1 4.14 0c1.58-1.08 2.27-.85 2.27-.85.45 1.15.17 2.01.08 2.22.53.58.85 1.31.85 2.22 0 3.17-1.92 3.87-3.75 4.08.29.25.55.73.55 1.48 0 1.07-.01 1.93-.01 2.2 0 .23.15.5.58.41A8.28 8.28 0 0 0 20.25 12c0-4.58-3.69-8.25-8.25-8.25Z" />
    </svg>
  );
}

export function App() {
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [pointer, setPointer] = useState({ x: 0, y: 0, active: false });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeScene, setActiveScene] = useState<(typeof scenes)[number]["id"]>("preface");
  const [clock, setClock] = useState(() => new Date());

  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        id: index,
        left: (index * 7.4 + (index % 4) * 11) % 100,
        size: 15 + ((index * 3) % 14),
        delay: `${-index * 1.7}s`,
        duration: `${14 + (index % 6) * 2.6}s`,
        sway: `${(index % 2 === 0 ? 1 : -1) * (18 + (index % 5) * 6)}px`,
        blur: `${index % 5 === 0 ? 0.3 : 0}px`,
        opacity: `${0.3 + (index % 4) * 0.12}`,
      })),
    []
  );

  useEffect(() => {
    const syncViewport = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };

    const syncPointer = (event: PointerEvent) => {
      setPointer({ x: event.clientX, y: event.clientY, active: true });
    };

    const syncTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      setPointer({ x: touch.clientX, y: touch.clientY, active: true });
    };

    const releasePointer = () => {
      setPointer((prev) => ({ ...prev, active: false }));
    };

    const syncScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const next = height > 0 ? window.scrollY / height : 0;
      setScrollProgress(next);
    };

    syncViewport();
    syncScroll();
    setPointer({ x: window.innerWidth * 0.5, y: window.innerHeight * 0.45, active: false });

    window.addEventListener("resize", syncViewport);
    window.addEventListener("pointermove", syncPointer);
    window.addEventListener("pointerleave", releasePointer);
    window.addEventListener("touchstart", syncTouch, { passive: true });
    window.addEventListener("touchmove", syncTouch, { passive: true });
    window.addEventListener("touchend", releasePointer, { passive: true });
    window.addEventListener("scroll", syncScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("pointermove", syncPointer);
      window.removeEventListener("pointerleave", releasePointer);
      window.removeEventListener("touchstart", syncTouch);
      window.removeEventListener("touchmove", syncTouch);
      window.removeEventListener("touchend", releasePointer);
      window.removeEventListener("scroll", syncScroll);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveScene(entry.target.id as (typeof scenes)[number]["id"]);
          }
        });
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0.2,
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  const pointerX = viewport.w ? pointer.x / viewport.w : 0.5;
  const pointerY = viewport.h ? pointer.y / viewport.h : 0.5;
  const windX = (pointerX - 0.5) * 32;
  const windY = (pointerY - 0.5) * 22;

  const scrollToScene = (sceneId: (typeof scenes)[number]["id"]) => {
    document.getElementById(sceneId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const deskStyle = {
    transform: `perspective(1400px) rotateX(${(0.52 - pointerY) * 7}deg) rotateY(${(pointerX - 0.5) * 10}deg) translateY(${scrollProgress * -28}px)`,
  };

  const folioStyle = {
    transform: `translate(${windX * 0.18}px, ${windY * 0.12}px) rotate(${(pointerX - 0.5) * 3.4}deg)`,
  };

  const cursorStyle = {
    transform: `translate3d(${pointer.x - 140}px, ${pointer.y - 140}px, 0) scale(${pointer.active ? 1 : 0.84})`,
    opacity: pointer.active ? 1 : 0.52,
  };

  return (
    <div
      className="relative overflow-x-hidden text-[#4d3341]"
      style={
        {
          "--wind-x": `${windX}px`,
          "--wind-y": `${windY}px`,
        } as CSSProperties
      }
    >
      <div className="cursor-blush hidden md:block" style={cursorStyle} />

      {petals.map((petal) => (
        <span
          key={petal.id}
          className="sakura-petal"
          style={
            {
              "--petal-left": `${petal.left}%`,
              "--petal-size": `${petal.size}px`,
              "--petal-delay": petal.delay,
              "--petal-duration": petal.duration,
              "--petal-sway": petal.sway,
              "--petal-blur": petal.blur,
              "--petal-opacity": petal.opacity,
            } as CSSProperties
          }
        />
      ))}

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
        <div className="mx-auto flex max-w-7xl items-start justify-between gap-4">
          <div className="pointer-events-auto nav-shell inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm tracking-[0.24em] text-[#6f4958] uppercase">
            <span className="h-2 w-2 rounded-full bg-[#cf7d9b] shadow-[0_0_0_6px_rgba(214,140,167,0.12)]" />
            Hoshino Rokuzakura
          </div>

          <div className="pointer-events-auto hidden items-center gap-2 rounded-full px-2 py-2 md:flex nav-shell">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => scrollToScene(scene.id)}
                className={`nav-dot ${activeScene === scene.id ? "nav-dot--active" : ""}`}
                aria-label={`前往${scene.name}`}
              >
                <span className="text-[10px] tracking-[0.24em]">{scene.index}</span>
                <span className="text-xs tracking-[0.22em]">{scene.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <aside className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <div className="side-rail">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => scrollToScene(scene.id)}
              className={`side-rail__item ${activeScene === scene.id ? "side-rail__item--active" : ""}`}
              aria-label={`跳转到${scene.name}`}
            >
              <span>{scene.index}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="relative z-10">
        <section id="preface" data-scene className="scene-section flex min-h-screen items-center pt-28 sm:pt-32">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <div className="text-sm tracking-[0.35em] text-[#8b6272] uppercase">page 01 · 春夜桌案</div>

              <div className="desk-stage" style={deskStyle}>
                <div className="desk-lacquer">
                  <div className="desk-orbit desk-orbit--one" />
                  <div className="desk-orbit desk-orbit--two" />
                  <div className="desk-orb" />
                  <div className="desk-seal" />
                  <div className="desk-teacup">
                    <div className="desk-teacup__tea" />
                  </div>

                  <article className="folio-sheet" style={folioStyle}>
                    <div className="folio-sheet__pin" />
                    <p className="folio-kicker">for 星野六樱</p>
                    <h1 className="text-4xl leading-none text-[#5f3747] sm:text-5xl lg:text-[4.2rem]">星野六樱</h1>
                    <p className="mt-2 text-sm tracking-[0.2em] text-[#8b5f70]">HOSHINO ROKUZAKURA</p>
                    <p className="mt-6 max-w-lg text-[1.05rem] leading-8 text-[#6f4b59] sm:text-[1.1rem]">
                      这里不把春天直接做成大幅招呼，而像把一张写到一半的纸页放在桌上：有花影、釉光、纸纹，也有一点尚未说尽的话。
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#7b5462]">
                      <span className="soft-chip">常驻偏好：衬线字 · 旧纸感 · 樱粉</span>
                      <span className="soft-chip">气味设定：夜风、茶香与淡淡木质</span>
                    </div>
                  </article>

                  <a
                    href={portals[0].href}
                    target="_blank"
                    rel="noreferrer"
                    className="tab-link tab-link--blog"
                    aria-label="前往博客"
                  >
                    <span className="tab-link__label">Blog</span>
                    <strong>花签</strong>
                    <small>写字的地方</small>
                  </a>

                  <a
                    href={portals[1].href}
                    target="_blank"
                    rel="noreferrer"
                    className="tab-link tab-link--social"
                    aria-label="前往社媒主页"
                  >
                    <span className="tab-link__label">Social</span>
                    <strong>会客</strong>
                    <small>更即时的日常</small>
                  </a>

                  <a
                    href={portals[2].href}
                    target="_blank"
                    rel="noreferrer"
                    className="tab-link tab-link--github"
                    aria-label="前往GitHub主页"
                  >
                    <span className="tab-link__label">GitHub</span>
                    <strong>机关</strong>
                    <small>代码与实验</small>
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:pl-6">
              <div className="story-card">
                <p className="story-card__eyebrow">非典型首页</p>
                <h2 className="text-2xl leading-snug text-[#5b3947] sm:text-3xl">
                  第一屏不做常规 Hero，
                  <br />
                  而像一只被风轻轻掀开的抽屉。
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#6f4b59]">
                  移动鼠标或手指，花瓣和纸面会跟着呼吸；继续向下翻，就能看到三个入口分别以不同性格展开。
                </p>
                <button type="button" onClick={() => scrollToScene("passages")} className="silk-button mt-6">
                  向下翻页
                </button>
              </div>

              <div className="info-row grid gap-4 sm:grid-cols-2">
                <div className="mini-panel">
                  <div className="mini-panel__title">此刻时间</div>
                  <div className="mini-panel__value">
                    {clock.toLocaleTimeString("zh-CN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                  <div className="mini-panel__meta">
                    {clock.toLocaleDateString("zh-CN", {
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </div>
                </div>

                <div className="mini-panel mini-panel--vertical">
                  <div className="mini-panel__title">小注</div>
                  <p className="mini-panel__text">请把三枚入口替换成她自己的真实地址，风格就会更完整。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="passages" data-scene className="scene-section flex min-h-screen items-center">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.26fr_0.74fr]">
            <div className="flex items-start justify-between gap-6 lg:flex-col lg:justify-start">
              <div>
                <div className="text-sm tracking-[0.35em] text-[#8b6272] uppercase">page 02 · 三枚花签</div>
                <h2 className="mt-5 text-3xl leading-tight text-[#5f3948] sm:text-4xl">沿着滚动，一页页看见她会去的地方。</h2>
                <p className="mt-4 max-w-sm text-[1rem] leading-8 text-[#6d4957]">
                  每个入口都做成不同的纸质与釉感，既像书签，也像放在案上的名片。轻触、悬停时会有细微的抬升与光泽变化。
                </p>
              </div>

              <div className="vertical-poem">
                春色不必喧哗
                <br />
                只要被好好安放
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              {portals.map((portal, index) => {
                const lift = (0.5 - scrollProgress) * (index === 1 ? 14 : 10);
                const drift = (pointerX - 0.5) * (index % 2 === 0 ? 7 : -7);

                return (
                  <a
                    key={portal.id}
                    href={portal.href}
                    target="_blank"
                    rel="noreferrer"
                    className="portal-card"
                    style={
                      {
                        transform: `translateY(${lift}px) rotate(${drift * 0.28}deg)`,
                        "--portal-accent": portal.accent,
                        "--portal-glaze": portal.glaze,
                      } as CSSProperties
                    }
                  >
                    <div className="portal-card__head">
                      <span className="portal-card__tag">{portal.label}</span>
                      <span className="portal-card__domain">{portal.domain}</span>
                    </div>
                    <div className="portal-card__icon">
                      <PortalIcon id={portal.id} />
                    </div>
                    <div className="portal-card__body">
                      <h3 className="text-2xl text-[#573644]">{portal.title}</h3>
                      <p className="mt-4 text-[0.98rem] leading-8 text-[#6f4b59]">{portal.description}</p>
                    </div>
                    <div className="portal-card__foot">
                      <span>点此进入</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section id="garden" data-scene className="scene-section flex min-h-screen items-center pb-20">
          <div className="mx-auto w-full max-w-7xl">
            <div className="garden-panel">
              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="text-sm tracking-[0.35em] text-[#8b6272] uppercase">page 03 · 庭末留灯</div>
                  <h2 className="text-3xl leading-tight text-[#5d3948] sm:text-4xl">像一张真正住着人的主页，而不是模板里统一长出来的那一种。</h2>
                  <p className="max-w-2xl text-[1.05rem] leading-8 text-[#6d4957]">
                    她可以在这里放博客、社媒和 GitHub，也可以后来慢慢添上更多页面。现在先让风格、氛围、入口和节奏成立——其余内容，会像花期一样慢慢长出来。
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {portals.map((portal) => (
                      <a
                        key={portal.id}
                        href={portal.href}
                        target="_blank"
                        rel="noreferrer"
                        className="garden-link"
                      >
                        <span className="garden-link__name">{portal.label}</span>
                        <span className="garden-link__title">{portal.title}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="mini-panel">
                    <div className="mini-panel__title">今日状态</div>
                    <div className="mini-panel__value">樱色偏浓，风速很轻</div>
                    <div className="mini-panel__meta">鼠标与触屏都可以带动花影和界面光泽。</div>
                  </div>

                  <div className="mini-panel">
                    <div className="mini-panel__title">最后一句</div>
                    <p className="mini-panel__text">愿她每次更新这里，都像在纸页边缘补上一笔新的季节。</p>
                    <button type="button" onClick={() => scrollToScene("preface")} className="silk-button mt-5">
                      回到案前
                    </button>
                  </div>
                </div>
              </div>

              <footer className="mt-10 flex flex-col gap-3 border-t border-[#d5b0bf]/60 pt-6 text-sm text-[#815968] sm:flex-row sm:items-center sm:justify-between">
                <p>为网名“星野六樱”写下的樱粉色个人主页草稿。</p>
                <p>替换真实链接后即可作为主页使用。</p>
              </footer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
