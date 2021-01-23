#### Bug Description
Calling `mpv.on("status")` throws `TypeError property on doesn't exist on mpv` even checking if the `mpv.isRunning()`

#### How To Reproduce
```ts
//working with react-nodegui
useEffect(()=>{
(async ()=>{
    await mpv.start();
    await mpv.load("path/to/file");
})()
if(mpv.isRunning()){
      mpv.on("status", (status)=>{
        console.log(status) //throws TypeError
      })
   }
}, [])
```

#### Expected behavior
This should **log the status** when any status is changed of the `mpv` player


##### Software Versions
 - Node-Mpv: v2.0.0@beta.1
 - MPV: v6.14.11
 - OS: `KDE Neon Linux` running Ubuntu `LTS 20.04 base`. Linux `kernel - 5.4.0-64-generic`

I believe its a typescript related issue as the types of `on` events aren't defined in the `index.d.ts`. I'm not familiar with this package that much so I didn't go deeper. Thanks in advance for making this awesome node_module & for helping regrading the issue. 