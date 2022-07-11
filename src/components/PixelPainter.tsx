import React, {
  DragEvent,
  useRef,
  useState,
  MouseEvent,
  useEffect
} from "react";
import "./../styles/PixelPainter.scss";
import * as R from "ramda";
// import * as htmlToImage from "html-to-image";
import deleteIcon from "/images/icon_delete.svg";
import html2canvas from "html2canvas";
import wantItAll from "./../../jsonFile_wantItAll.json";

type DragPoint = {
  x: number;
  y: number;
};
interface ColorPickTarget extends EventTarget {
  value: string;
}
interface paintDataFromLocal {
  id: string;
  listData: coordinateData[];
  thumbnail: string;
  canvaColor: string;
}

interface coordinateData {
  coor: string;
  color: string;
}

interface WholeData {
  ele: HTMLDivElement;
  id: string;
  color: string;
}

export default () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const listPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [list, setList] = useState<coordinateData[]>([]);
  const [showText, setShowText] = useState<boolean>(false);
  const [prevDataFromLocal, setPrevDataFromLocal] = useState<
    paintDataFromLocal[]
  >([]);
  const [detectList, setDetectList] = useState<DragPoint[]>([]);
  const [currentColor, setCurrentColor] = useState<string>("#ccff00");
  const [currentPicked, setCurrentPicked] = useState<paintDataFromLocal>();
  const [speed, setSpeed] = useState<number>(10);
  const [canvaColor, setCanvaColor] = useState<string>("#0c1117"); //#0c1a2a
  const [enable, setEnable] = useState<Boolean>(true);
  const [penWidth, setPenWidth] = useState<number>(2);
  const [showMenu, setShowMenu] = useState<Boolean>(false);

  // console.log('navigator.userAgent', navigator.userAgent)
  const isMobile = navigator.userAgent.indexOf(" Mobile ") !== -1;

  const reportWindowSize = (event: any) => {
    let rootContainer: HTMLDivElement | null = document.querySelector(
      ".pixel_canva_container"
    );
    if (!rootContainer) return;
    if (event.type === "load") {
      rootContainer.style.setProperty(
        "--main-width",
        window.innerWidth.toString()
      );
    } else {
      rootContainer.style.setProperty(
        "--main-width",
        window.innerWidth.toString()
      );
    }
    // let appEle:any = document.querySelector('.App');
    // if(!appEle) return;
    // if(isMobile) {
    //   appEle.style.height = 'unset';
    // } else {
    //   appEle.style.height = 'unset';
    // }
  };

  useEffect(() => {
    window.addEventListener("load", reportWindowSize);
    window.addEventListener("resize", reportWindowSize);
  }, []);

  useEffect(() => {
    getDataAgain();
  }, []);

  const getDataAgain = () => {
    let prevData = window.localStorage.getItem("pixelData");
    // console.log('prevData', prevData)
    let prevList = prevData ? JSON.parse(prevData) : [];
    // console.log("prevList", prevList);
    setPrevDataFromLocal(prevList);
  };

  const deleteThisPaint = (id: string) => {
    let tempList = [...prevDataFromLocal];
    let modified = tempList.filter((item) => {
      return item.id !== id;
    });
    setPrevDataFromLocal(modified);
    window.localStorage.setItem("pixelData", JSON.stringify(modified));
  };

  const allList = new Array(70).fill(0).map((item, key) => {
    return new Array(70).fill(0).map((key) => {
      return key + 1;
    });
  });

  let tempList = [...list];

  const resetList = () => {
    setList([]);
  };

  const resizeStroke = (cubeId: string, scale: number) => {
    let itemX = Number(cubeId.split("-")[0]);
    let itemY = Number(cubeId.split("-")[1]);

    let scaledPenWidth = scale;

    const newList = new Array(scaledPenWidth).fill(0).map((item, key) => {
      return new Array(scaledPenWidth).fill(0).map((innerItem, innerKey) => {
        return { accordingX: innerKey, accordingY: key };
      });
    });

    let scaledCubeList = R.flatten(newList).map((item, index) => {
      let prepareCubeId = `${itemX + item.accordingX}-${
        itemY + item.accordingY
      }`;
      let prepareEle = document.getElementById(prepareCubeId);
      return { ele: prepareEle, id: prepareCubeId, color: currentColor };
    });
    return scaledCubeList;
  };

  const handleReturnCubeId = (coorItem: DragPoint) => {
    // console.log("coorItem", coorItem);
    if (!wrapRef.current) return;
    let parentRect = wrapRef.current.getBoundingClientRect();
    if (
      coorItem.x <= 0 ||
      coorItem.y <= 0 ||
      coorItem.x > parentRect.width ||
      coorItem.y > parentRect.height
    )
      return;
    let cubeList = [...document.querySelectorAll(".cube")];
    // console.log("parentRect", parentRect);
    try {
      let targetEle = cubeList.filter((cubeItem, cubeIndex) => {
        let cubeRect: DOMRect = cubeItem.getBoundingClientRect();
        // console.log('cubeRect', cubeRect)
        let cubeLeft = cubeRect.left - parentRect.left;
        let cubeRight = cubeRect.right - parentRect.left;
        let cubeTop = cubeRect.top - parentRect.top;
        let cubeBottom = cubeRect.bottom - parentRect.top;
        return (
          coorItem.x <= cubeRight &&
          cubeLeft <= coorItem.x &&
          coorItem.y <= cubeBottom &&
          cubeTop <= coorItem.y
        );
      })[0];
      if (!targetEle.id) return;
      // console.log("targetEle.id", targetEle.id);

      //--------------------------------------------------------------------------------

      // return { ele: targetEle, id: targetEle.id, color: currentColor };
      return resizeStroke(targetEle.id, penWidth);
    } catch (err) {
      console.log("err", err);
    }
  };
  useEffect(() => {
    if (detectList.length) {
      // console.log("detectList", detectList);
      let lastChanged = handleReturnCubeId(detectList[detectList.length - 1]);
      // console.log("lastChanged", lastChanged);
      if (lastChanged) {
        // if (
        //   R.includes(
        //     lastChanged.id,
        //     tempList.map((item) => {
        //       return item.coor;
        //     })
        //   )
        // ) {
        //   let index = tempList
        //     .map((item) => {
        //       return item.coor;
        //     })
        //     .indexOf(lastChanged.id);
        //   // console.log("index", index);
        //   if (index >= 0) {
        //     tempList[index].color = lastChanged.color;
        //   }
        // } else {
        // let fla = R.flatten(lastChanged);
        // console.log('fla', fla)

        lastChanged.forEach((item: any, key) => {
          // console.log("___________item", item);
          tempList.push({ coor: item.id, color: item.color });
        });
        // tempList.push({ coor: lastChanged.id, color: lastChanged.color });
        // }
        setList(tempList);
      }
    }
  }, [detectList]);

  // console.log('list', list)

  let temp = [...detectList];
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!wrapRef.current) return;
    let parentRect = wrapRef.current.getBoundingClientRect();
    let clientXX = e.touches[0].clientX - parentRect.left;
    let clientYY = e.touches[0].clientY - parentRect.top;
    // let coor = { x: 8*Math.floor(clientXX/8), y: 8*Math.floor(clientYY/8) };
    let coor = { x: Math.floor(clientXX), y: Math.floor(clientYY) };
    // console.log("coor", coor);

    if (R.includes(coor, temp)) {
    } else {
      temp.push(coor);
    }
    setDetectList(temp);
  };

  useEffect(() => {
    paintCube();
  }, [list]);

  const renderCube = () => {
    return allList.map((dayItem, key) => {
      return (
        <div key={key} className="hour">
          {dayItem.map((cubeItem, cubeKey) => {
            return (
              <div
                className={`cube`}
                id={`${key + 1}-${cubeKey + 1}`}
                key={cubeKey}
              ></div>
            );
          })}
        </div>
      );
    });
  };

  const paintCube = () => {
    if (list.length) {
      list.forEach((item, index) => {
        let cubeEle = document.getElementById(item.coor);
        if (cubeEle) {
          cubeEle.style.backgroundColor = item.color;
        }
      });
    } else {
      let cubeList = [...document.querySelectorAll(".cube")];
      cubeList.forEach((item, index) => {
        let cubeEle = document.getElementById(item.id);
        if (cubeEle) {
          cubeEle.style.backgroundColor = "transparent";
        }
      });
    }
  };

  const save = async () => {
    let thumbnail = await saveThumbnail();
    let prepare = [
      ...prevDataFromLocal,
      {
        listData: list,
        id: new Date().getTime().toString(),
        thumbnail: thumbnail,
        canvaColor: canvaColor
      }
    ];
    console.log("prepare", prepare);
    window.localStorage.setItem("pixelData", JSON.stringify(prepare));

    setTimeout(() => {
      getDataAgain();
      temp = [];
      tempList = [];
      setDetectList([]);
      setList([]);
    }, 200);
    setTimeout(() => {
      if (listPanelRef.current) {
        listPanelRef.current.scrollTo({
          top: Number.MAX_SAFE_INTEGER,
          behavior: "smooth"
        });
      }
    }, 250);
  };

  const importList = () => {
    setList([]);
  };

  const readFile = (e: any) => {
    let files = e.target.files;
    // console.log(files);
    let reader = new FileReader();
    reader.onload = (r: any) => {
      //  console.log(r.target.result);
      try {
        let toParse = JSON.parse(r.target.result);
        // console.log("toParse", toParse);
        // console.log("toParse.listData", toParse.listData);
        setList(toParse.listData);
        setCanvaColor(toParse.canvaColor);
      } catch (parseErr) {
        console.log("parseErr", parseErr);
      }
    };
    reader.readAsText(files[0]);
  };

  // console.log('enable', enable)

  useEffect(() => {
    if (showText) {
      tempList = [];
      if (!currentPicked) return;
      setCanvaColor(currentPicked.canvaColor);
      setEnable(false);
      currentPicked.listData.forEach((item, key) => {
        setTimeout(() => {
          tempList.push({ coor: item.coor, color: item.color });
          setList([...tempList]);
        }, speed * key);
        setCurrentPicked(undefined);
        setShowText(false);
      });
      let count = currentPicked.listData.length;
      // console.log('count', count)
      console.log("count*speed", count * speed);
      setTimeout(() => {
        setEnable(true);
      }, count * speed);
      // console.log('count * speed', count * speed)
    }
  }, [showText]);

  const play = (item: paintDataFromLocal) => {
    setList([]);
    setCurrentPicked(item);
    setShowText(true);
  };

  const exportData = (item: paintDataFromLocal) => {
    const content = JSON.stringify({
      listData: item.listData,
      canvaColor: item.canvaColor
    });
    let a = document.createElement("a");
    let file = new Blob([content], { type: "text/json" });
    a.href = URL.createObjectURL(file);
    a.download = `jsonFile_${Math.floor(Number(item.id) / 100000)}.json`;
    a.click();
  };

  const changeColor = (eventTarget: ColorPickTarget) => {
    setCurrentColor(eventTarget.value);
  };
  const changeCanvaColor = (eventTarget: ColorPickTarget) => {
    setCanvaColor(eventTarget.value);
  };

  const saveThumbnail = () => {
    return new Promise<string>((resolve, reject) => {
      if (!wrapRef.current) return;

      html2canvas(wrapRef.current)
        .then((canvas) => {
          let dataUrl = canvas.toDataURL("image/jpeg");
          // .replace("image/jpeg", "image/octet-stream");

          resolve(dataUrl);
        })
        .catch((err) => {
          console.log("err", err);
          reject(err);
        });
    });
  };

  const demoPlay = () => {
    let prevSpeed = speed;
    // console.log("wantItAll", wantItAll);
    // console.log("wantItAll.listData", wantItAll.listData);
    let coordinateList = wantItAll.listData;
    let scale = penWidth;
    // let modified = coordinateList.map((item, index) => {
    // let innerList = resizeStroke(item.coor, scale, 'pureCoordinate', item.color);
    // console.log('innerList', innerList)
    // return innerList.map((innerItem, innerIndex)=>{
    //   return (
    //     innerItem.id
    //   )
    // })
    //   let itemX = Number(item.coor.split('-')[0]);
    //   let itemY = Number(item.coor.split('-')[1]);
    //
    //   let newCoor = `${itemX*scale}-${itemY*scale}`;
    //   let origin = `${itemX*scale-1}-${itemY*scale-1}`;
    //   let bottom = `${itemX*scale-1}-${itemY*scale}`;
    //   let right = `${itemX*scale}-${itemY*scale-1}`;
    //   return [{coor:newCoor, color:item.color},{coor:origin, color:item.color}, {coor:bottom, color:item.color}, {coor:right, color:item.color}]

    //   let itemX = Number(item.coor.split("-")[0]);
    //   let itemY = Number(item.coor.split("-")[1]);

    //   let scale = 2;

    //   const newList = new Array(scale).fill(0).map((item, key) => {
    //     return new Array(scale).fill(0).map((innerItem, innerKey) => {
    //       return { accordingX: innerKey, accordingY: key };
    //     });
    //   });
    //   console.log("newList", newList);

    //   let scaledCubeList = R.flatten(newList).map((accordingItem, index) => {
    //     let prepareCubeId = `${itemX + accordingItem.accordingX}-${
    //       itemY + accordingItem.accordingY
    //     }`;
    //     console.log("prepareCubeId", prepareCubeId);

    //     return { coor: prepareCubeId, color: item.color };
    //   });
    //   // console.log('scaledCubeList', scaledCubeList)

    //   return scaledCubeList;
    // });
    // console.log("modified________", modified);
    // let flattenLsit = R.flatten(modified);
    // console.log("flattenLsit", flattenLsit);

    // wantItAll.listData = R.flatten(flattenLsit);

    let tempObj = { ...wantItAll, id: "", thumbnail: "" };
    setList([]);
    setCurrentPicked(tempObj);
    setShowText(true);
    setSpeed(1);
    setTimeout(() => {
      // console.log('prevSpeed', prevSpeed)
      setSpeed(prevSpeed);
    }, 7303);
  };

  const changePenWidth = (item: number) => {
    setPenWidth(item);
    setShowMenu(false);
  };

  const srokeWidthList = [1, 2, 3, 4, 5, 6];
  return (
    <div className="pixel_canva_container">
      <div className="paint_body">
        <div className="header">Pixel Painter</div>
        <div className="wrap_outer">
          <div
            className="wrap"
            // draggable={true}
            ref={wrapRef}
            onTouchMove={(e) => handleTouchMove(e)}
            style={{ backgroundColor: canvaColor }}
          >
            {renderCube()}
          </div>

        </div>
        <div className="btn_area">
          <div className="btn_first_row">
            <div className="tip_text">畫布參數</div>
            <div className="color_area">
              <div className="color_tip">Canva</div>
              <input
                type="color"
                value={canvaColor}
                className="color_picker"
                onChange={(e) => changeCanvaColor(e.target)}
              />
            </div>
            <div className="color_area">
              <div className="color_tip">Color</div>
              <input
                type="color"
                value={currentColor}
                className="color_picker"
                onChange={(e) => changeColor(e.target)}
              />
            </div>
            <div className="speed_area">
              <div className="speed_tip">Speed</div>
              <input
                type="number"
                className="speed_input"
                onChange={(e) => setSpeed(Number(e.target.value))}
                placeholder={speed.toString()}
              ></input>
            </div>
            <div className="stroke_area">
              <div className="stroke_tip">Stroke</div>
              {/* //setPenWidth */}
              <div className="dropdown_container">
                <div className={`dropdown_bg ${showMenu ? 'show_bg':'hide_bg'}`} onClick={() => setShowMenu(!showMenu)}></div>
                <div className="dropdown_body">
                  <div
                    className="default_area"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    {/* <div className="icon_area">
                    <div className={`arrow_down ${showMenu ? 'unfold':''}`}></div>
                  </div> */}
                    {penWidth}
                  </div>
                  <div
                    className={`unfold_area ${showMenu ? "unfold" : ""}`}
                  >
                    {srokeWidthList.map((item, index) => {
                      return (
                        <div
                          className="each_row"
                          key={index}
                          onClick={() => changePenWidth(item)}
                        >
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn_second_row">
            <div className="tip_text">功能操作</div>
            <div
              className={`btn demo_btn ${enable ? "" : "disable"}`}
              onClick={demoPlay}
            >
              Demo
            </div>
            <div
              className={`btn import_btn ${enable ? "" : "disable"}`}
              onClick={importList}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="inputFile"
                name="inputFile"
                className="file_input"
                onChange={(e) => readFile(e)}
              />
              Import
            </div>
            <div
              className={`btn reset_btn ${enable ? "" : "disable"}`}
              onClick={resetList}
            >
              Reset
            </div>
            <div
              className={`btn save_btn ${enable ? "" : "disable"}`}
              onClick={save}
            >
              Save
            </div>
          </div>
        </div>
      </div>
      {prevDataFromLocal.length ? (
        <div className="list_panel">
          <div className="list_panel_header">筆跡紀錄</div>
          <div className="list_panel_wrap" ref={listPanelRef}>
            <div className="list_panel_inner">
              {prevDataFromLocal.map((item, index) => {
                return (
                  <div className="each_row" key={index}>
                    {/* <div className="data_id">{item.id}</div> */}
                    <div className="data_id">{index + 1}</div>
                    <img className="thumbnail" src={item.thumbnail}></img>
                    <div
                      className={`play_btn ${enable ? "" : "disable"}`}
                      onClick={() => play(item)}
                    >
                      Play
                    </div>

                    <div
                      className={`export_btn  ${enable ? "" : "disable"}`}
                      onClick={() => exportData(item)}
                    >
                      Export
                    </div>
                    <div
                      className={`delete_icon  ${enable ? "" : "disable"}`}
                      style={{ backgroundImage: `url(${deleteIcon})` }}
                      onClick={() => deleteThisPaint(item.id)}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};