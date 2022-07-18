import React, {
  DragEvent,
  useRef,
  useState,
  MouseEvent,
  useEffect,
  Fragment
} from "react";
import "./../styles/PixelPainter.scss";
import * as R from "ramda";
import html2canvas from "html2canvas";
import starryNight from "./../../jsonFile_16578030.json";
import wantItAll from "./../../jsonFile_16576374.json";
import wretched from "./../../jsonFile_wretched.json";
import DragPanel from "./DragPanel";
import GalleryPanel from "./GalleryPanel";
import ModalTool from "./ModalTool";
import SetupPanel from "./SetupPanel";
import moment from "moment";
// import Dropdown from "./Dropdown";
import DropExpand from "./DropExpand";

type DragPoint = {
  x: number;
  y: number;
};
interface ColorPickTarget extends EventTarget {
  value: string;
}
export interface paintDataFromLocal {
  id: string;
  listData: coordinateData[];
  thumbnail: string;
  canvaColor: string;
}

interface coordinateData {
  coor: string;
  color: string;
}

interface PalmRejectSize {
  w: number;
  h: number;
}

export default () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const listPanelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [list, setList] = useState<coordinateData[]>([]);
  // console.log("list", list);

  const [showText, setShowText] = useState<boolean>(false);
  const [prevDataFromLocal, setPrevDataFromLocal] = useState<
    paintDataFromLocal[]
  >([]);
  const [detectList, setDetectList] = useState<DragPoint[]>([]);
  // console.log('detectList', detectList)
  const [currentColor, setCurrentColor] = useState<string>("#ccff00");
  const [currentPicked, setCurrentPicked] = useState<paintDataFromLocal>();
  const [speed, setSpeed] = useState<number>(5);
  const [canvaColor, setCanvaColor] = useState<string>("#0c1117"); //#0c1a2a
  const [enable, setEnable] = useState<Boolean>(true);
  const [penWidth, setPenWidth] = useState<number>(1);
  const [showPenWidthMenu, setShowPenWidthMenu] = useState<Boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<Boolean>(false);
  const [showSpeedMenuBeforePlay, setShowSpeedMenuBeforePlay] =
    useState<Boolean>(true);
  const [eraseMode, setEraseMode] = useState(false);
  const [galleryModalShow, setGalleryModalShow] = useState(false);
  const [setupPanelShow, setSetupPanelShow] = useState(true);
  const [demoIndex, setDemoIndex] = useState<number>(0);
  const [palmRejectShow, setPalmRejectShow] = useState<Boolean>(false);
  const [palmRejectSizeIndex, setPalmRejectSizeIndex] = useState<number>(0);
  const [isPainting, setIsPainting] = useState<Boolean>(false);
  const [touchBehavior, setTouchBehavior] = useState<string>("finger");
  const [touchTipShow, setTouchTipShow] = useState<Boolean>(false);
  const [cubeDivide, setCubeDivide] = useState<number>(50);
  const [speedChangeModalShow, setSpeedChangeModalShow] =
    useState<Boolean>(false);
  // console.log('eraseMode', eraseMode)
  const palmRejectSizeList: PalmRejectSize[] = [
    { w: 200, h: 300 },
    { w: 250, h: 400 },
    { w: 350, h: 500 },
    { w: 450, h: 600 }
  ];

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

  const allList = new Array(cubeDivide).fill(0).map((item, key) => {
    return new Array(cubeDivide).fill(0).map((key) => {
      return key + 1;
    });
  });

  let tempList = [...list];

  const resetList = () => {
    setList([]);
    setCanvaColor("transparent");
    eraseAllCube();
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
    // console.log("newList", newList);
    const makeupStroke = (
      newList: {
        accordingX: number;
        accordingY: number;
      }[][]
    ) => {
      switch (penWidth) {
        case 3:
          return [[newList[0][1]], newList[1], [newList[2][1]]];
          break;
        case 4:
          return [
            [newList[0][1], newList[0][2]],
            newList[1],
            newList[2],
            [newList[3][1], newList[3][2]]
          ];
          break;
        case 5:
          return [
            [newList[0][2]],
            [newList[1][1], newList[1][2], newList[1][3]],
            newList[2],
            [newList[3][1], newList[3][2], newList[3][3]],
            [newList[4][2]]
          ];
          break;
        case 6:
          return [
            [newList[0][2], newList[0][3]],
            [newList[1][1], newList[1][2], newList[1][3], newList[1][4]],
            newList[2],
            newList[3],
            [newList[4][1], newList[4][2], newList[4][3], newList[4][4]],
            [newList[5][2], newList[5][3]]
          ];
          break;

        default:
          return newList;
          break;
      }
    };
    let makeupResult = makeupStroke(newList);
    // console.log('makeupResult', makeupResult)
    let scaledCubeList = R.flatten(makeupResult).map((item, index) => {
      let prepareCubeId = `${itemX + item.accordingX}-${
        itemY + item.accordingY
      }`;
      let prepareEle = document.getElementById(prepareCubeId);
      if (!prepareEle) return;
      return { ele: prepareEle, id: prepareCubeId, color: currentColor };
    });
    return scaledCubeList;
  };

  const getCubeId = (coorItem: DragPoint) => {
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

      // return { ele: targetEle, id: targetEle.id, color: currentColor };
      return resizeStroke(targetEle.id, penWidth);
    } catch (err) {
      console.log("err", err);
    }
  };
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
                style={{
                  width: `${700 / cubeDivide}px`,
                  height: `${700 / cubeDivide}px`
                }}
              ></div>
            );
          })}
        </div>
      );
    });
  };

  const canvaTouchEnable = (e: React.TouchEvent) => {
    let behavior: string = getTouchBehavior(e);
    // console.log("behavior", behavior);
    if (behavior !== touchBehavior) {
      return false;
    } else {
      return true;
    }
  };
  const touchStart = (e: React.TouchEvent) => {
    setIsPainting(true);
    if (!canvaTouchEnable(e)) return;
  };
  const eraseMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!canvaTouchEnable(e)) return;
    // console.log('!canvaTouchEnable(e)', !canvaTouchEnable(e))

    if (!wrapRef.current) return;
    let parentRect = wrapRef.current.getBoundingClientRect();
    let clientXX = e.touches[0].clientX - parentRect.left;
    let clientYY = e.touches[0].clientY - parentRect.top;
    // let coor = { x: 8*Math.floor(clientXX/8), y: 8*Math.floor(clientYY/8) };
    let coor = { x: Math.floor(clientXX), y: Math.floor(clientYY) };
    // console.log("erase_coor", coor);

    let currentChanged = getCubeId(coor);
    // console.log("currentChanged", currentChanged);
    if (!currentChanged) return;
    let currentChangedWithoutColor = currentChanged.map((item: any, index) => {
      if (!item) return;
      return { coor: item.id };
    });
    // console.log("currentChangedWithoutColor", currentChangedWithoutColor);
    if (!currentChangedWithoutColor) return;
    let withoutColor = list.map((i) => {
      return { coor: i.coor };
    });
    // console.log("withoutColor", withoutColor);
    let compareResult = currentChangedWithoutColor.filter((x) =>
      R.includes(x, withoutColor)
    );

    // console.log("erase_compareResult", compareResult);

    compareResult.forEach((item) => {
      if (!item) return;
      let ele = document.getElementById(item.coor);
      if (!ele) return;
      let targetIndex = tempList
        .map((i) => {
          return i.coor;
        })
        .indexOf(item.coor);
      if (targetIndex >= 0) {
        tempList.splice(targetIndex, 1);
      }
      eraseCubeSingle(item);
      setList(tempList);
    });
  };

  useEffect(() => {
    if (detectList.length) {
      // console.log("detectList", detectList);
      let lastChanged = getCubeId(detectList[detectList.length - 1]);
      // console.log("lastChanged", lastChanged);
      if (lastChanged) {
        // console.log("lastChanged", lastChanged);
        lastChanged.forEach((item: any, key) => {
          if (!item) return;
          if (eraseMode) {
            // eraseCubeSingle({ coor: item.id });
          } else {
            paintCubeSingle({ coor: item.id, color: item.color });
          }
        });
      }
    }
  }, [detectList]);

  let temp = [...detectList];
  const paintMove = (e: React.TouchEvent) => {
    e.stopPropagation();

    if (!canvaTouchEnable(e)) {
      // alert(`若欲使用${touchBehavior === 'finger' ? '觸控筆':'指尖'}繪圖，請修改設定`);
      setTouchTipShow(true);

      return;
    }

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
    // console.log("temp", temp);
    setDetectList(temp);
  };

  const paintCubeSingle = (position: coordinateData) => {
    let cubeEle = document.getElementById(position.coor);
    if (!cubeEle) return;
    cubeEle.style.backgroundColor = position.color;
  };
  const eraseCubeSingle = (position: { coor: string }) => {
    let cubeEle = document.getElementById(position.coor);
    if (!cubeEle) return;
    cubeEle.style.backgroundColor = "transparent";
  };

  const eraseAllCube = () => {
    let cubeList = [...document.querySelectorAll(".cube")];
    cubeList.forEach((item) => {
      let cubeEle = document.getElementById(item.id);
      if (!cubeEle) return;
      cubeEle.style.backgroundColor = "transparent";
    });
  };

  const eraseEnd = (e: any) => {
    setIsPainting(false);
    if (!canvaTouchEnable(e)) return;
  };
  const paintEnd = (e: any) => {
    setIsPainting(false);
    // if (!canvaTouchEnable(e)) return;
    let allCubeData = detectList.map((item) => {
      return getCubeId(item);
    });
    let flattenList = R.flatten(allCubeData);
    // console.log("allCubeData", allCubeData);
    // console.log("flattenList", flattenList);
    flattenList.forEach((item: any, index) => {
      if (!item) return;
      tempList.push({ coor: item.id, color: item.color });
    });
    // console.log('tempList', tempList)
    setList(R.uniq(tempList));
    setDetectList([]);
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
      // setList([]);
      resetList();
      setGalleryModalShow(true);
      setSetupPanelShow(false);
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
    tempList = [];
    // setList([]);
    resetList();
  };

  const readFile = (e: any) => {
    let files = e.target.files;
    console.log(files);
    

    let reader = new FileReader();
    reader.onload = (r: any) => {
      //  console.log(r.target.result);
      try {
        let toParse = JSON.parse(r.target.result);
        console.log("toParse", toParse);
        console.log("toParse.listData", toParse.listData);
        setList(toParse.listData);
        let listFromFile: coordinateData[] = toParse.listData;
        listFromFile.forEach((item, key) => {
          setTimeout(() => {
            paintCubeSingle({ coor: item.coor, color: item.color });
          }, speed * key);
        });

        setCanvaColor(toParse.canvaColor);
      } catch (parseErr) {
        console.log("parseErr", parseErr);
      }
    };
    reader.readAsText(files[0]);
    e.target.value="";
  };

  // console.log('enable', enable)

  // useEffect(()=>{

  //   let ddate = [
  //     { "coor": "31-26", "color": "#ffc5ab" },
  //     { "coor": "31-25", "color": "#ffc5ab" },
  //     { "coor": "31-24", "color": "#ffc5ab" },
  //     { "coor": "31-23", "color": "#ffc5ab" },
  //     { "coor": "31-22", "color": "#ffc5ab" },
  //     { "coor": "31-21", "color": "#ffc5ab" },
  //     { "coor": "31-20", "color": "#ffc5ab" },
  //     { "coor": "31-19", "color": "#ffc5ab" },
  //     { "coor": "31-18", "color": "#ffc5ab" },
  //     { "coor": "31-17", "color": "#ffc5ab" },
  //     { "coor": "31-16", "color": "#ffc5ab" },
  //     { "coor": "30-15", "color": "#ffc5ab" },
  //     { "coor": "30-14", "color": "#ffc5ab" },
  //     { "coor": "29-14", "color": "#ffc5ab" },
  //     { "coor": "29-13", "color": "#ffc5ab" },
  //     { "coor": "28-13", "color": "#ffc5ab" },
  //     { "coor": "31-15", "color": "#ffc5ab" },
  //     { "coor": "32-17", "color": "#ffc5ab" },
  //     { "coor": "32-18", "color": "#ffc5ab" },
  //     { "coor": "32-19", "color": "#ffc5ab" },
  //     { "coor": "32-20", "color": "#ffc5ab" },
  //     { "coor": "32-21", "color": "#ffc5ab" },
  //     { "coor": "32-22", "color": "#ffc5ab" },
  //     { "coor": "32-23", "color": "#ffc5ab" },
  //     { "coor": "32-24", "color": "#ffc5ab" },
  //     { "coor": "18-14", "color": "#ffc5ab" },
  //     { "coor": "19-14", "color": "#ffc5ab" },
  //     { "coor": "19-13", "color": "#ffc5ab" },
  //     { "coor": "20-13", "color": "#ffc5ab" },
  //     { "coor": "20-12", "color": "#ffc5ab" },
  //     { "coor": "21-12", "color": "#ffc5ab" },
  //     { "coor": "21-11", "color": "#ffc5ab" },
  //     { "coor": "22-11", "color": "#ffc5ab" },
  //     { "coor": "23-11", "color": "#ffc5ab" },
  //     { "coor": "24-11", "color": "#ffc5ab" },
  //     { "coor": "25-11", "color": "#ffc5ab" },
  //     { "coor": "26-11", "color": "#ffc5ab" },
  //     { "coor": "27-11", "color": "#ffc5ab" },
  //     { "coor": "28-11", "color": "#ffc5ab" },
  //     { "coor": "28-12", "color": "#ffc5ab" },
  //     { "coor": "29-12", "color": "#ffc5ab" },
  //     { "coor": "30-12", "color": "#ffc5ab" },
  //     { "coor": "30-13", "color": "#ffc5ab" },
  //     { "coor": "31-13", "color": "#ffc5ab" },
  //     { "coor": "31-14", "color": "#ffc5ab" },
  //     { "coor": "32-16", "color": "#ffc5ab" },
  //     { "coor": "32-15", "color": "#ffc5ab" },
  //     { "coor": "27-12", "color": "#ffc5ab" },
  //     { "coor": "26-12", "color": "#ffc5ab" },
  //     { "coor": "25-12", "color": "#ffc5ab" },
  //     { "coor": "24-12", "color": "#ffc5ab" },
  //     { "coor": "23-12", "color": "#ffc5ab" },
  //     { "coor": "22-12", "color": "#ffc5ab" },
  //     { "coor": "21-13", "color": "#ffc5ab" },
  //     { "coor": "18-15", "color": "#ffc5ab" },
  //     { "coor": "18-18", "color": "#ffc5ab" },
  //     { "coor": "30-17", "color": "#ffc5ab" },
  //     { "coor": "29-17", "color": "#ffc5ab" },
  //     { "coor": "29-16", "color": "#ffc5ab" },
  //     { "coor": "30-16", "color": "#ffc5ab" },
  //     { "coor": "30-18", "color": "#ffc5ab" },
  //     { "coor": "29-18", "color": "#ffc5ab" },
  //     { "coor": "28-18", "color": "#ffc5ab" },
  //     { "coor": "27-18", "color": "#ffc5ab" },
  //     { "coor": "26-18", "color": "#ffc5ab" },
  //     { "coor": "25-18", "color": "#ffc5ab" },
  //     { "coor": "24-18", "color": "#ffc5ab" },
  //     { "coor": "23-18", "color": "#ffc5ab" },
  //     { "coor": "22-18", "color": "#ffc5ab" },
  //     { "coor": "22-17", "color": "#ffc5ab" },
  //     { "coor": "22-16", "color": "#ffc5ab" },
  //     { "coor": "22-15", "color": "#ffc5ab" },
  //     { "coor": "22-14", "color": "#ffc5ab" },
  //     { "coor": "23-14", "color": "#ffc5ab" },
  //     { "coor": "23-15", "color": "#ffc5ab" },
  //     { "coor": "23-16", "color": "#ffc5ab" },
  //     { "coor": "23-17", "color": "#ffc5ab" },
  //     { "coor": "24-14", "color": "#ffc5ab" },
  //     { "coor": "24-13", "color": "#ffc5ab" },
  //     { "coor": "25-13", "color": "#ffc5ab" },
  //     { "coor": "26-13", "color": "#ffc5ab" },
  //     { "coor": "27-13", "color": "#ffc5ab" },
  //     { "coor": "27-14", "color": "#ffc5ab" },
  //     { "coor": "27-15", "color": "#ffc5ab" },
  //     { "coor": "28-15", "color": "#ffc5ab" },
  //     { "coor": "29-15", "color": "#ffc5ab" },
  //     { "coor": "28-14", "color": "#ffc5ab" },
  //     { "coor": "28-16", "color": "#ffc5ab" },
  //     { "coor": "28-17", "color": "#ffc5ab" },
  //     { "coor": "27-16", "color": "#ffc5ab" },
  //     { "coor": "26-16", "color": "#ffc5ab" },
  //     { "coor": "25-16", "color": "#ffc5ab" },
  //     { "coor": "24-16", "color": "#ffc5ab" },
  //     { "coor": "24-15", "color": "#ffc5ab" },
  //     { "coor": "25-15", "color": "#ffc5ab" },
  //     { "coor": "26-15", "color": "#ffc5ab" },
  //     { "coor": "26-14", "color": "#ffc5ab" },
  //     { "coor": "25-14", "color": "#ffc5ab" },
  //     { "coor": "24-17", "color": "#ffc5ab" },
  //     { "coor": "25-17", "color": "#ffc5ab" },
  //     { "coor": "23-20", "color": "#ffc5ab" },
  //     { "coor": "24-20", "color": "#ffc5ab" },
  //     { "coor": "25-20", "color": "#ffc5ab" },
  //     { "coor": "26-20", "color": "#ffc5ab" },
  //     { "coor": "27-20", "color": "#ffc5ab" },
  //     { "coor": "28-20", "color": "#ffc5ab" },
  //     { "coor": "28-19", "color": "#ffc5ab" },
  //     { "coor": "29-20", "color": "#ffc5ab" },
  //     { "coor": "30-20", "color": "#ffc5ab" },
  //     { "coor": "30-21", "color": "#ffc5ab" },
  //     { "coor": "29-21", "color": "#ffc5ab" },
  //     { "coor": "29-22", "color": "#ffc5ab" },
  //     { "coor": "29-23", "color": "#ffc5ab" },
  //     { "coor": "30-23", "color": "#ffc5ab" },
  //     { "coor": "28-23", "color": "#ffc5ab" },
  //     { "coor": "27-23", "color": "#ffc5ab" },
  //     { "coor": "26-23", "color": "#ffc5ab" },
  //     { "coor": "26-22", "color": "#ffc5ab" },
  //     { "coor": "27-22", "color": "#ffc5ab" },
  //     { "coor": "28-21", "color": "#ffc5ab" },
  //     { "coor": "27-21", "color": "#ffc5ab" },
  //     { "coor": "26-21", "color": "#ffc5ab" },
  //     { "coor": "25-21", "color": "#ffc5ab" },
  //     { "coor": "24-21", "color": "#ffc5ab" },
  //     { "coor": "23-21", "color": "#ffc5ab" },
  //     { "coor": "22-21", "color": "#ffc5ab" },
  //     { "coor": "22-20", "color": "#ffc5ab" },
  //     { "coor": "22-19", "color": "#ffc5ab" },
  //     { "coor": "23-19", "color": "#ffc5ab" },
  //     { "coor": "21-19", "color": "#ffc5ab" },
  //     { "coor": "21-20", "color": "#ffc5ab" },
  //     { "coor": "21-21", "color": "#ffc5ab" },
  //     { "coor": "21-22", "color": "#ffc5ab" },
  //     { "coor": "21-23", "color": "#ffc5ab" },
  //     { "coor": "21-24", "color": "#ffc5ab" },
  //     { "coor": "21-25", "color": "#ffc5ab" },
  //     { "coor": "21-26", "color": "#ffc5ab" },
  //     { "coor": "20-26", "color": "#ffc5ab" },
  //     { "coor": "20-25", "color": "#ffc5ab" },
  //     { "coor": "20-24", "color": "#ffc5ab" },
  //     { "coor": "20-23", "color": "#ffc5ab" },
  //     { "coor": "20-22", "color": "#ffc5ab" },
  //     { "coor": "20-21", "color": "#ffc5ab" },
  //     { "coor": "20-20", "color": "#ffc5ab" },
  //     { "coor": "20-19", "color": "#ffc5ab" },
  //     { "coor": "19-19", "color": "#ffc5ab" },
  //     { "coor": "18-19", "color": "#ffc5ab" },
  //     { "coor": "22-27", "color": "#ffc5ab" },
  //     { "coor": "22-26", "color": "#ffc5ab" },
  //     { "coor": "22-25", "color": "#ffc5ab" },
  //     { "coor": "22-24", "color": "#ffc5ab" },
  //     { "coor": "22-23", "color": "#ffc5ab" },
  //     { "coor": "23-26", "color": "#ffc5ab" },
  //     { "coor": "23-25", "color": "#ffc5ab" },
  //     { "coor": "23-24", "color": "#ffc5ab" },
  //     { "coor": "24-24", "color": "#ffc5ab" },
  //     { "coor": "25-24", "color": "#ffc5ab" },
  //     { "coor": "25-25", "color": "#ffc5ab" },
  //     { "coor": "24-25", "color": "#ffc5ab" },
  //     { "coor": "24-26", "color": "#ffc5ab" },
  //     { "coor": "24-27", "color": "#ffc5ab" },
  //     { "coor": "24-28", "color": "#ffc5ab" },
  //     { "coor": "23-28", "color": "#ffc5ab" },
  //     { "coor": "23-27", "color": "#ffc5ab" },
  //     { "coor": "25-28", "color": "#ffc5ab" },
  //     { "coor": "26-28", "color": "#ffc5ab" },
  //     { "coor": "27-28", "color": "#ffc5ab" },
  //     { "coor": "28-28", "color": "#ffc5ab" },
  //     { "coor": "22-11", "color": "#ffc5ab" },
  //     { "coor": "23-11", "color": "#ffc5ab" },
  //     { "coor": "24-11", "color": "#ffc5ab" },
  //     { "coor": "25-11", "color": "#ffc5ab" },
  //     { "coor": "26-11", "color": "#ffc5ab" },
  //     { "coor": "27-11", "color": "#ffc5ab" },
  //     { "coor": "22-13", "color": "#ffc5ab" },
  //     { "coor": "23-13", "color": "#ffc5ab" },
  //     { "coor": "22-14", "color": "#ffc5ab" },
  //     { "coor": "19-22", "color": "#ffc5ab" },
  //     { "coor": "19-23", "color": "#ffc5ab" },
  //     { "coor": "23-23", "color": "#ffc5ab" },
  //     { "coor": "24-23", "color": "#ffc5ab" },
  //     { "coor": "25-23", "color": "#ffc5ab" },
  //     { "coor": "25-22", "color": "#ffc5ab" },
  //   ]
  //   function sort(ddate:any) {
  //     return ddate.sort(() => Math.random() - 0.5);
  //   }
  //   let final = sort(ddate);
  //   console.log('final', final)
  //   console.log('finalToJson', JSON.stringify(final))
  // },[])

  useEffect(() => {
    if (showText) {
      tempList = [];
      if (!currentPicked) return;
      setCanvaColor(currentPicked.canvaColor);
      setEnable(false);
      currentPicked.listData.forEach((item, key) => {
        setTimeout(() => {
          tempList.push({ coor: item.coor, color: item.color });
          paintCubeSingle({ coor: item.coor, color: item.color });
          setList([...tempList]);
        }, speed * key);
        setCurrentPicked(undefined);
        setShowText(false);
      });
      let count = currentPicked.listData.length;
      // console.log('count', count)
      setTimeout(() => {
        setEnable(true);
      }, count * speed);
      // console.log('count * speed', count * speed)
    }
  }, [showText]);

  // const play = (item: paintDataFromLocal) => {
  const play = () => {
    // console.log("item", item);
    setSpeedChangeModalShow(false);
    resetList();
    setGalleryModalShow(false);
    setTimeout(() => {
      // setCurrentPicked(item);
      setShowText(true);
    }, 500);
    if(!currentPicked) return;
    let count = currentPicked.listData.length;
    setTimeout(() => {
      console.log("open");
      setSetupPanelShow(true);
    }, count * speed);
  };

  const exportData = (item: paintDataFromLocal) => {
    const content = JSON.stringify({
      listData: item.listData,
      canvaColor: item.canvaColor ? item.canvaColor : canvaColor
    });
    let a = document.createElement("a");
    let file = new Blob([content], { type: "text/json" });
    a.href = URL.createObjectURL(file);
    // a.download = `jsonFile_${Math.floor(Number(item.id) / 100000)}.json`;
    a.download = `jsonFile_${moment(new Date())
      .locale("zh-tw")
      .format("YYYY_MM_DD_hh_mm_ss")}.json`;
    a.click();
  };

  const changeColor = (eventTarget: ColorPickTarget) => {
    setCurrentColor(eventTarget.value);
    setEraseMode(false);
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

    let demoList = [starryNight, wantItAll, wretched];
    let tempObj = { ...demoList[demoIndex], id: "", thumbnail: "" };
    // setList([]);
    resetList();
    setCurrentPicked(tempObj);
    setShowText(true);
    setSpeed(5);

    let count = starryNight.listData.length;
    // console.log('count', count)
    let tempIndex = 0;
    if (demoIndex === 2) {
      tempIndex = 0;
    } else {
      tempIndex = demoIndex+1;
    }
    setDemoIndex(tempIndex);
    setTimeout(() => {
      // console.log('prevSpeed', prevSpeed)
      setSpeed(prevSpeed);
    }, count * speed);
  };

  const changePenWidth = (item: number) => {
    setPenWidth(item);
    setShowPenWidthMenu(false);
  };

  const changeSpeedLevel = (item: number) => {
    setSpeed(item);
    setShowSpeedMenu(false);
    setShowSpeedMenuBeforePlay(false);
  };

  const resizePalmRejectionPanel = (behavior: string) => {
    let tempIndex = palmRejectSizeIndex;
    switch (behavior) {
      case "minus":
        console.log("縮小");
        if (tempIndex !== 0) {
          tempIndex--;
          console.log("tempIndex", tempIndex);
          setPalmRejectSizeIndex(tempIndex);
        }
        break;
      case "add":
        console.log("放大");
        if (tempIndex !== 3) {
          tempIndex++;
          console.log("tempIndex", tempIndex);
          setPalmRejectSizeIndex(tempIndex);
        }
        break;

      default:
        break;
    }
  };

  const getTouchBehavior = (e: any) => {
    // console.log("e", e);
    // console.log("e.touches", e.touches);
    // console.log("e.touches[0]", e.touches[0]);
    if (!e.touches.length) return "";
    // console.log('getTouchBehavior_e.touches[0].radiusX', e.touches[0].radiusX)
    const roundTo = (num: number, decimal: number) => {
      return (
        Math.round((num + Number.EPSILON) * Math.pow(10, decimal)) /
        Math.pow(10, decimal)
      );
    };
    const radius = roundTo(Number(e.touches[0].radiusX), 1);

    // return radius;
    if (radius > 1) {
      return "finger";
    } else {
      return "stylus";
    }
  };

  const visitGallery = () => {
    setGalleryModalShow(true);
    setSetupPanelShow(false);
  };

  const closeGalleryModal = () => {
    setGalleryModalShow(false);
    setSetupPanelShow(true);
  };

  const startBounce = () => {
    let toggleEle = document.getElementById("touchBehavior");
    if (!toggleEle) return;
    toggleEle.classList.add("must_bounce");

    setTimeout(() => {
      if (!toggleEle) return;
      toggleEle.classList.remove("must_bounce");
    }, 3500);
  };

  const closeTouchTipModal = () => {
    setTouchTipShow(false);
    startBounce();
  };

  // useEffect(() => {
  //   let debugListEle = document.querySelector(".debug_list");
  //   if (debugListEle) {
  //     debugListEle.scrollTo({
  //       top: Number.MAX_SAFE_INTEGER,
  //       behavior: "auto",
  //     });
  //   }
  // }, [list]);

  const handleEnlargeThisCube = (item: coordinateData) => {
    let thisId = item.coor;
    let thisCubeEle = document.getElementById(thisId);
    // console.log('thisCubeEle', thisCubeEle)
    thisCubeEle?.classList.add("enlarge");
    let cubeList = [...document.querySelectorAll(".cube")];
    cubeList
      .filter((i) => {
        return i !== thisCubeEle;
      })
      .forEach((c) => {
        c.classList.remove("enlarge");
      });
  };

  const playFromThisFrame = (index: number, canvaColor: string) => {
    console.log("index", index);
    let tempOrigin = [...list];
    let fromThisFrame = tempOrigin.filter((item, key) => {
      return key >= index;
    });
    console.log("fromThisFrame", fromThisFrame);
    tempList = [];
    setList([]);
    eraseAllCube();
    setEnable(false);
    fromThisFrame.forEach((item, key) => {
      setTimeout(() => {
        tempList.push({ coor: item.coor, color: item.color });
        paintCubeSingle({ coor: item.coor, color: item.color });
        setList([...tempList]);
      }, speed * key);
      setCurrentPicked(undefined);
      // setShowText(false);
    });
    let count = fromThisFrame.length;
    // console.log('count', count)
    setTimeout(() => {
      setEnable(true);
    }, count * speed);
  };

  const removeThisFrame = (index: number) => {
    console.log("index", index);
    let tempOrigin = [...list];
    let othersFrame = tempOrigin.filter((item, key) => {
      return key !== index;
    });
    othersFrame.forEach((item, index) => {
      paintCubeSingle({ coor: item.coor, color: item.color });
    });
    setList(othersFrame);
  };
  const speedList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="pixel_canva_container">
      <div className="paint_body">
        <div className="header">Pixel Painter</div>
        <div className="btn_area">
          <div className="btn_row">
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
            <div
              className={`btn history_btn ${enable ? "" : "disable"}`}
              onClick={() => visitGallery()}
            >
              Gallery
            </div>
            <div
              className={`btn setup_btn ${enable ? "" : "disable"} ${
                setupPanelShow ? "active" : ""
              }`}
              onClick={() => setSetupPanelShow(!setupPanelShow)}
            >
              Setup
            </div>
          </div>
        </div>
        <div className="wrap_outer">
          <div
            className="wrap"
            // draggable={true}
            ref={wrapRef}
            onTouchStart={(e) => touchStart(e)}
            onTouchMove={(e) => (eraseMode ? eraseMove(e) : paintMove(e))}
            onTouchEnd={(e) => (eraseMode ? eraseEnd(e) : paintEnd(e))}
            style={{ backgroundColor: canvaColor }}
          >
            {renderCube()}
          </div>
        </div>
        {/* {list.length ? (
          <Fragment>
            <div
              className="debug_list"
              style={{
                overflow: "scroll",
                height: "300px",
                marginTop: "50px",
                position: "relative"
              }}
            >
              {list.map((item, index) => {
                return (
                  <div
                    className="each_test_row"
                    style={{ display: "flex", borderBottom: "1px solid green" }}
                    key={index}
                  >
                    <div
                      className="each_test_number"
                      style={{
                        color: "#2a8ab6",
                        fontSize: "18px",
                        textAlign: "start",
                        width: "60px"
                      }}
                    >
                      {index}
                    </div>
                    <div
                      className="each_test_coor"
                      style={{
                        color: "#fff",
                        fontSize: "18px",
                        textAlign: "start",
                        width: "100px"
                      }}
                    >
                      {item.coor}
                    </div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: item.color,
                        marginRight: "15px"
                      }}
                    ></div>
                    <button onClick={() => handleEnlargeThisCube(item)}>
                      顯示
                    </button>
                    <button
                      onClick={() => playFromThisFrame(index, canvaColor)}
                    >
                      從此播放
                    </button>
                    <button onClick={(e) => removeThisFrame(index)}>
                      刪除此格
                    </button>
                  </div>
                );
              })}
            </div>
          </Fragment>
        ) : null} */}
      </div>
      {prevDataFromLocal.length && galleryModalShow ? (
        <ModalTool
          modalShow={galleryModalShow}
          modalCloseFunction={() => closeGalleryModal()}
          modalWidth={"unset"}
          modalHeight={"500px"}
          modalInnerBackground={"#ffffff20"}
          backgroundOpacity={0.5}
          background={"#000000"}
          zIndex={12}
        >
          <GalleryPanel
            prevDataFromLocal={prevDataFromLocal}
            listPanelRef={listPanelRef}
            enable={enable}
            play={play}
            exportData={exportData}
            deleteThisPaint={deleteThisPaint}
            setGalleryModalShow={setGalleryModalShow}
            closeGalleryModal={closeGalleryModal}
            setSpeedChangeModalShow={setSpeedChangeModalShow}
            setCurrentPicked ={setCurrentPicked}
          ></GalleryPanel>
        </ModalTool>
      ) : null}
      {touchTipShow ? (
        <ModalTool
          modalShow={touchTipShow}
          modalCloseFunction={() => setTouchTipShow(false)}
          modalWidth={"200px"}
          modalHeight={"120px"}
          modalInnerBackground={"#0c1a2a"}
          backgroundOpacity={0.5}
          background={"#000000"}
          zIndex={12}
        >
          <div className="touch_tip_wrap">
            <div className="touch_tip_text">
              若欲使用{touchBehavior === "finger" ? "觸控筆" : "指尖"}
              繪圖
              <br />
              請修改設定
            </div>
            <div
              className={`btn touch_tip_btn ${enable ? "" : "disable"}`}
              onClick={() => closeTouchTipModal()}
            >
              Yes
            </div>
          </div>
        </ModalTool>
      ) : null}

      {speedChangeModalShow ? (
        <ModalTool
          modalShow={speedChangeModalShow}
          modalCloseFunction={() => setSpeedChangeModalShow(false)}
          modalWidth={"340px"}
          modalHeight={"160"}
          modalInnerBackground={"#0c1a2a"}
          backgroundOpacity={0.5}
          background={"#000000"}
          zIndex={12}
        >
          <div className={`speed_change_wrap ${showSpeedMenuBeforePlay ? '':'changed'}`}>
            <div className="speed_change_tip_text">
             Change Play Speed Level? 
              (Max:1)
            </div>
            <DropExpand
              showMenu={showSpeedMenuBeforePlay}
              setShowMenu={setShowSpeedMenuBeforePlay}
              defaultValue={speed}
              menuList={speedList}
              action={changeSpeedLevel}

            ></DropExpand>
            <div className="btn_wrap">
            <div
              className={`btn speed_change_btn ${enable ? "" : "disable"}`}
              onClick={() => play()}
            >
              Start
            </div>
            </div>

          </div>
        </ModalTool>
      ) : null}

      <DragPanel
        id={"functionPanel"}
        background={"transparent"}
        childStartX={0.08}
        childStartY={0.1}
        show={setupPanelShow}
        setShow={setSetupPanelShow}
      >
        <SetupPanel
          canvaColor={canvaColor}
          changeCanvaColor={changeCanvaColor}
          currentColor={currentColor}
          changeColor={changeColor}
          showSpeedMenu={showSpeedMenu}
          setShowSpeedMenu={setShowSpeedMenu}
          speed={speed}
          changeSpeedLevel={changeSpeedLevel}
          showPenWidthMenu={showPenWidthMenu}
          setShowPenWidthMenu={setShowPenWidthMenu}
          penWidth={penWidth}
          changePenWidth={changePenWidth}
          eraseMode={eraseMode}
          setEraseMode={setEraseMode}
          palmRejectShow={palmRejectShow}
          setPalmRejectShow={setPalmRejectShow}
          touchBehavior={touchBehavior}
          setTouchBehavior={setTouchBehavior}
        />
      </DragPanel>
      {/* <DragPanel
        id={"palmRejectionPanel"}
        background={"transparent"}
        childStartX={0.65}
        childStartY={0.1}
        show={palmRejectShow}
        setShow={setPalmRejectShow}
        dragDisable={isPainting}
      >
        <div
          className="palm_rejection"
          style={{
            width: `${palmRejectSizeList[palmRejectSizeIndex].w}px`,
            height: `${palmRejectSizeList[palmRejectSizeIndex].h}px`
          }}
        >
          <div className="resize_btn_area">
            <div
              className={`resize_btn ${
                palmRejectSizeIndex === 0 ? "disable" : ""
              }`}
              onClick={() => resizePalmRejectionPanel("minus")}
            >
              -
            </div>
            <div
              className={`resize_btn ${
                palmRejectSizeIndex === 2 ? "disable" : ""
              }`}
              onClick={() => resizePalmRejectionPanel("add")}
            >
              +
            </div>
          </div>
        </div>
      </DragPanel> */}
    </div>
  );
};
