'use client'

import { useEffect, useState } from "react";

import styles from './part.css'

import Image from 'next/image'
import Link from "next/link";

import Box from "@/components/Box";
import list from '@/components/list'
import upperCase from "@/components/upperCase";

const View = ({part, view, toggleView}) => {
  const show = list.find(item => item.type == part);
  const prop = show ? show.prop : {};

  const parts = list.filter(item => item.sector == show.sector)
  const known = parts.indexOf(show)
  const back = parts[known ? known-1 : parts.length-1]
  const next = parts[known == parts.length-1 ? 0 : known+1]

  const [toggle, setToggle] = useState(false);
  const toggleSpeed = () => {
    setToggle(!toggle);
  };

  return <>
    <div className="control">
      <div id="left">
        {show == back ? '' : 
        <Link href={`/components/${back.sector}/${back.type}`}>
          <button className={`view ${view ? "" : "-hide"}`} title="Jump Before">
            <span className="bi bi-arrow-bar-left"></span>
            <span className="name">{upperCase(back.type)}</span>
          </button>
        </Link>}
        <Link href={`/components/${show.sector}`}>
          <button className={`view ${view ? "" : "-hide"}`} title="Jump Next">
            <span className={`bi bi-${show.icon}`}></span>
            <span className="name">{upperCase(show.sector)}</span>
          </button>
        </Link>
      </div>
      <div id="navigate">
        <Link href={show.origin} target="_blank">
          <button className={`view ${view ? "" : "-hide"}`} title="Visit 3D Asset Original Source">
            <span className="bi bi-arrow-up-right-circle"></span>
          </button>
        </Link>
        <button className={`view ${view ? "" : "-lil"}`} title="Hide Elements" onClick={toggleView} >
          <span className="bi bi-aspect-ratio"></span>
        </button>
      </div>
    </div>
    <div className="control r">
      <div id="right">
        {show == next ? '' : 
        <Link href={`/components/${next.sector}/${next.type}`}>
          <button className={`view ${view ? "" : "-hide"}`} title="Jump Next">
            <span className="name">{upperCase(next.type)}</span>
            <span className="bi bi-arrow-bar-right"></span>
          </button>
        </Link>}
        <button 
          className={`view ${view ? "" : "-hide"} ${(prop.speed ? (prop.speed.some(speedValue => speedValue !== 0) ? "show" : "hide") : 0)}`} onClick={toggleSpeed} >
          <span className={`bi bi-toggle-${toggle ? "on" : "off"}`}></span>
        </button>
      </div>
    </div>
    <Box
      scale={prop.scale ? prop.scale : 1}
      speed={toggle ? prop.speed : [0,0,0]}
      light={prop.light}
      pos={prop.pos}
      rot={prop.rot}
      src={prop.src}
    />
  </>
}

const Bar = ({part, view, togglePad}) => {
  const show = list.find(item => item.type == part);

  const [hide, setHide] = useState(false);
  const toggleHide = () => {
    setHide(!hide);
  }

  const [desc, setDesc] = useState("");
  useEffect(() => {
    let text = ""
    for (let i = 0; i < show.info[0].length; i ++) {
      if (show.info[0][i] == ".") break
      text += show.info[0][i]
    }
    text += "."
    setDesc(text)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, desc])

  return (
    <>
      <div className={`explainer view ${view ? "" : "-hide"}`}>
        <div className="del" id="hide" onClick={() => toggleHide()}>
          <span className={`bi bi-chevron-compact-${hide ? "left" : "right"}`}></span>
        </div>
        <div className={`del ${hide ? "hidden" : ""}`} id="content">
          <div className="head">
            <h1>{show ? show.name : ''}</h1>
            <button title="show" onClick={togglePad}>Show more</button>
          </div>
          <div id="text">
            <p>{show ? desc : ''}</p>
          </div>
        </div>
      </div>
    </>
  )
}

const Pad = ({togglePad, part}) => {
  const content = list.find(item => item.type == part)

  return (
    <div className="container">
      <div className="head">
        <span className="bi bi-x-lg" onClick={togglePad}></span>
        <div className="quick">
          <span className={`bi bi-${content.icon}`}></span> 
          <span>{upperCase(content.desc)}</span>
        </div>
      </div>
      <div className="body">
        <div id="desc" className="section">
          <div id="name">
            <h1>{content.name}</h1>
          </div>
          {content.info.map((item,i) => (
            <p key={i}>{item}</p>
          ))}
          {!content.spec.length ? '' : <>
            <h3>{content.name} Specification: </h3>
            {content.spec.map((item,i) => (
              <li key={i}>{item}</li>
            ))}
          </>}
          {content.price != "" ? <p className="price">Harga Pasaran: ±{content.price}</p> : ''}
        </div>
        <div id="img" className="section">
          <Image
            src={`/preview/${content.sector}-${content.type}-1.png`}
            alt="Tekkom"
            width={300}
            height={300/16*9}
            priority
          />
          <Image
            src={`/preview/${content.sector}-${content.type}-2.png`}
            alt="Tekkom"
            width={300}
            height={300/16*9}
            priority
          />
          <Image
            src={`/preview/${content.sector}-${content.type}-3.png`}
            alt="Tekkom"
            width={300}
            height={300/16*9}
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default function Viewer ({params}) {
  const [view, setView] = useState(true);
  const toggleView = () => setView(!view);

  const [dsp, setDsp] = useState(false);
  const [pad, setPad] = useState(false);
  const togglePad = () => {
    if (!pad) {
      setDsp(!dsp);
      setTimeout(() => {
        setPad(!pad);
      }, 10);
    }
    else {
      setPad(!pad);
      setTimeout(() => {
        setDsp(!dsp);
      }, 300);
    }
  }

  return (
    <div id="Viewer">
      <div className={`pad ${dsp ? 'dsp' : ''} ${pad ? 'show' : ''}`}>
        <Pad togglePad={togglePad} part={params.part}/>
      </div>
      <div className="title">
        <Image
          src="/common/tekkom.png"
          alt="Tekkom"
          width={100}
          height={40}
          priority
        />
      </div>

      <View part={params.part} view={view} toggleView={toggleView}/>
      <Bar part={params.part} view={view} togglePad={togglePad}/>
    </div>
  )
}