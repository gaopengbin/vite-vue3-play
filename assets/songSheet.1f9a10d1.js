import{f as c,r as i,w as u,o as p,b as m,d,t as f,l as _,J as g,a as y}from"./index.43cffb43.js";import{p as h}from"./moment.cbf9456f.js";import{_ as k}from"./songList.c958f310.js";const D=c({__name:"songSheet",setup(v){const t=i({}),o=g();u(()=>o.query.id,a=>{console.log(a),a&&l(a)});const l=a=>{h(a).then(({data:s})=>{console.log(s);let n=s.playlist.tracks.map(e=>({cover:e.al.picUrl,title:e.name,singer:e.ar.map(r=>r.name).join(","),album:e.al.name,time:e.dt,id:e.id,mv:e.mv}));s.playlist.tracks=n,t.value=s.playlist})};return p(()=>{console.log(o),o.query.id&&l(o.query.id)}),(a,s)=>(y(),m("div",null,[d("h1",null,f(t.value.name),1),_(k,{songlist:t.value.tracks},null,8,["songlist"])]))}});export{D as default};