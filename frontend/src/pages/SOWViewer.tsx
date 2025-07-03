import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardTitle } from '@/components/ui/card';
import TemplateApplier from '@/components/Viewer/TemplateApplier';
import type { SOWData, Slide } from '@/types/presentation';
import DownloadPDFButton from '@/components/Viewer/DownloadPDFButton';
import { ContentSplitter } from '@/utils/contentSplitter';
import { TEMPLATES } from '@/types/template';
import { api } from "../lib/api";
import { useAuth } from "../lib/useAuth";
import ListButton from '@/components/SOWListButton';
import BackToGeneratorButton from '@/components/BackToGeneratorButton';

const SOWViewer: React.FC = () => {
  const location = useLocation();
  const initialPresentation: SOWData | undefined = location.state?.presentation;

    const { token } = useAuth();
  const [allSows, setAllSows] = useState<SOWData[] | undefined>(undefined);

  useEffect(() => {
    const fetchSows = async () => {
      if (token) {
        try {
          const fetchedSows = await api.sows.getSows(token);
          setAllSows(fetchedSows);
        } catch (error) {
          console.error("Failed to fetch SOWs:", error);
        }
      }
    };
    fetchSows();
  }, [token]);

  const [presentationState, setPresentation] = useState<SOWData | undefined>(initialPresentation);
  const [currentSlide, setCurrentSlide] = useState(0);

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (initialPresentation) {
      setPresentation({ ...initialPresentation, totalSlides: initialPresentation.slides.length });
    } else if (allSows && allSows.length > 0) {
      setPresentation({ ...allSows[0], totalSlides: allSows[0].slides.length });
    }
  }, [initialPresentation, allSows]);

  const processedSlides = useMemo(() => {
    if (!presentationState?.slides) return [];

    const SUPPORT_SERVICES_TITLE = "Support Services";
    const SUPPORT_SERVICES_PREFIX = `- Workmates will provide one-month free support from the date of delivery of the project.\n- The support team will be available from Monday through Friday (10am-7pm Indian Time).\n- Fix any issues reported by the client on the default features delivered as per committed project modules.\n- Answer any questions related to the features we had delivered as per proposal.\n- Support does not cover any additional customization or fixing up of issues caused due to code level edits done from client side or through usage of any third party solution. In such case the free support will become void.\n\n`;

    const GENERAL_TERMS_TITLE = "General Terms";
    const GENERAL_TERMS_PREFIX = `- The work will be started upon receiving full requirements in writing from the Client.\n- Reasonable changes are accepted from the Client on\ncommencement of the project. Any Changes in Functionality or\nDesign once the work has started is not acceptable. And\nWorkmates treat it as a New Scope of Work.\n- In case, the Client adds more to the scope of the project,\nWorkmates is not obliged to work on it and shall be treated as\nNew scope or Milestone for which the client is Obliged to pay for\nthe additional duration worked.\n- The project will be deployed under one domain.`;

    const PROJECT_TERMS_TITLE = "Project Terms";
    const PROJECT_TERMS_PREFIX = `- The full picture at the time of quotation. Any discrepancy arising\ndue to unclear requirements will not be borne by Workmates.\n- Workmates will make every effort to complete the\nproject/changes in the given timeframe. Reasonable delays are\naccepted if functionalities are redefined or modified.\n- Any delays at client's end, may delay the project and proposed\ntimeframe All estimates/quotes are based on our understanding\nof your requirements and as per given time-frame. Please ensure\nand clarify our understanding in a face to face meeting.\n- By accepting a quote, you agree to and accept the terms and\nconditions of Workmates. Acceptance can be by email, payment\nof Initiation, signing a quote.\n- Clients must provide us with clear guidelines along with the flow\nor specific details they may require. When such details are not\nprovided, we will proceed with our understanding of the\nrequirements and quote accordingly. At a later stage, if a\ndiscrepancy arises, it may lead to additional costs to\naccommodate the changes. Thus, it is essential that you clarify\nevery aspect of your website/App development and ensure that\nyou have been quoted on the right requirements.\n- We operate in good faith and rely on our clients to disclose t s\nand may incur additional cost\n- Any bugs (programming errors) reported during or just after the\ndevelopment does not attract additional charges.\n- Any re-work on an already completed task will attract additional\ncharges. Any changes in the design after the design approval will\nincur additional charges.\n- Any modifications requested during the development or after the\nGo-Live approval will incur additional charges. All additional work,\nover and above the estimates is charged separately. Under no\ncircumstances will Workmates be liable for any delays caused by\nchange in the project brief.\n- Website/application content and all related materials need to be\nprovided to us before starting of the project. Any delays\nthereafter may delay the project.\n- Our websites/applications are generally tested on PCs, Mobile\nPhones and include near recent versions. If you require testing to\nbe done on any other browser or older version, please let us know\nin advance.\n- If your website/application is not hosted on a Workmates server,\nany additional man-hours that may be required due to any server\nor network related issues are not covered in our quotes and may\nbe charged separately.\n- If you require the project to be put on hold, please advise us in\nwriting in advance. And any advance paid will not be refunded.\nFurther details can be discussed if such a situation arises.\n- Workmates software codes (not including open source software)\nare copyrights of Workmates. Under no circumstance, the codes\nwill be allowed to be used for re-selling or duplication purposes.\n- Workmates takes no responsibility of any open source products\nsuch as WordPress, Open Source carts, Joomla etc. It is clients\nresponsibility to update all components and third party\nsoftwares. We suggest you to take regular back-ups to avoid any\ndisruptions.\n- The client must recognize that at times there may be unforeseen\ncircumstances that will delay the development process,\nparticularly with reference to the integration of third party\nsoftware. We will try our best to complete the project as agreed\nin the proposal. As long as it is within a reasonable period, the\nclient agrees not to penalize us for any genuine delay, when every\neffort to keep the project on the proposed schedule is taken.\n- Domain registration/renewal etc charges are not included as a\npart of any project/proposal unless mentioned otherwise. If\nrequired, a quote for which will be submitted separately and\napproved by the client.\n- Workmates generally builds and tests the websites/applications\non our own servers or hosted domains. Workmates cannot give\naccess to their test servers and test websites to the clients or\nany third party. The website/application can be transferred-off\nto a nominated 3rd party server upon full payment of all invoices\nand dues.\n- All communications/correspondences are generally done via\nemails. It is the client's responsibility to keep us updated with\ntheir relevant email addresses.`;

    const TERMINATION_TITLE = "Termination";
    const TERMINATION_PREFIX = `- Workmates reserves the right to terminate at any time with written\nnotice to the Client. Such notice will be given Fifteen (15) days prior\nto the termination. If the Scope of Work is not provided properly or\nthe Client makes us to perform certain tasks which is beyond the\nscope of this agreement or Non payment.\n- In the event of termination of this Agreement Workmates shall\ncompute a project completion percentage by comparing completed\ntasks with tasks on the project plan. The Client shall then pay to\nWorkmates the same percentage as agreed. Workmates shall\nevidence completed tasks to the Client by demonstrating working\nfunctionality or source code. Once Workmates receives the payment\ndue from the Client we will Share the Source Code and Knowledge\nTransfer.\n- The quotation is valid for 15 days from the date of receiving and may\nbe accepted at any time prior to that date.This quotation is subject\nto mutually acceptable terms and conditions.`;

    // Apply predefined content to slides
    const slidesWithContent = presentationState.slides.map(slide => {
      if (slide.template === 'signature' && presentationState?.clientName) {
        return { ...slide, content: presentationState.clientName };
      }
      if (slide.title === SUPPORT_SERVICES_TITLE) {
        return { ...slide, content: SUPPORT_SERVICES_PREFIX };
      }
      if (slide.title === GENERAL_TERMS_TITLE) {
        return { ...slide, content: GENERAL_TERMS_PREFIX };
      }
      if (slide.title === PROJECT_TERMS_TITLE) {
        return { ...slide, content: PROJECT_TERMS_PREFIX };
      }
      if (slide.title === TERMINATION_TITLE) {
        return { ...slide, content: TERMINATION_PREFIX };
      }
      return slide;
    });

    // Split slides that have overflowing content
    const finalSlides: Slide[] = [];
    
    slidesWithContent.forEach(slide => {
      const templateId = slide.template || 'generic';
      const template = TEMPLATES[templateId as keyof typeof TEMPLATES] || TEMPLATES.generic;
      
      // Skip content splitting for certain templates
      if (templateId === 'cover' || templateId === 'signature') {
        finalSlides.push(slide);
        return;
      }

      try {
        const splitSlides = ContentSplitter.splitSlideContent(slide, template);
        finalSlides.push(...splitSlides);
      } catch (error) {
        console.warn('Failed to split slide content, using original:', error);
        finalSlides.push(slide);
      }
    });

    return finalSlides;
  }, [presentationState]);

  const renderSlideContent = (slide: Slide) => {
    return (
      <TemplateApplier 
        slide={slide}
        className="w-full h-full"
        sowNumber={presentationState?.sowNumber}
        templateId={typeof slide.template === 'string' ? slide.template : 'plain'}
      />
    );
  };

  const totalSlides = processedSlides.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!presentationState) return;
      if (e.key === 'ArrowUp') {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'ArrowDown') {
        setCurrentSlide((prev) => (prev < processedSlides.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(0);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide(processedSlides.length - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationState, processedSlides.length]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const activeThumb = thumbnailRefs.current[currentSlide];
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentSlide]);

  if (!presentationState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 h-screen w-screen overflow-hidden relative flex items-center justify-center text-white">
        {allSows === undefined ? (
          <div>Loading SOWs...</div>
        ) : allSows.length === 0 ? (
          <div>No SOWs generated yet.</div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">Your Generated SOWs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSows.map((sow) => (
                <Card
                  key={sow.sowNumber || sow.title}
                  className="bg-white/10 border-white/20 text-white p-4 cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => setPresentation({ ...sow, totalSlides: sow.slides.length })}
                >
                  <CardTitle>{sow.title}</CardTitle>
                  <p className="text-sm text-white/70">Client: {sow.clientName}</p>
                  <p className="text-sm text-white/70">SOW Number: {sow.sowNumber}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const getBackgroundClass = () => {
    return 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${getBackgroundClass()} p-6 h-screen w-screen overflow-hidden relative`}>
      {/* Top Toolbar */}
      <div className="w-full flex justify-center" style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}>
        <div className="mt-4 max-w-5xl w-full rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 flex items-center justify-between relative" style={{ minHeight: 40, fontSize: '0.95rem', pointerEvents: 'auto' }}>
          <div className="flex items-center gap-4">
            <BackToGeneratorButton />
          </div>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 text-sm font-medium select-none pointer-events-none bg-white/10 border border-white/20 px-4 py-1 rounded-full shadow-sm">
            Page {currentSlide + 1} of {totalSlides}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <ListButton />
            <DownloadPDFButton slides={processedSlides} title={presentationState.title || 'Presentation'} />
          </div>
        </div>
      </div>

      {/* Sidebar Thumbnails */}
      <div className="fixed left-0 top-0 h-full flex flex-col items-center justify-center py-8 pl-8 pr-4 z-10" style={{ width: 80, paddingTop: 80 }}>
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[70vh] px-1 pt-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {processedSlides.map((_, index) => (
            <button
              key={index}
              data-slide-index={index}
              ref={el => { thumbnailRefs.current[index] = el; }}
              onClick={() => setCurrentSlide(index)}
              className={
                `w-14 h-20 border-2 rounded-xl flex-shrink-0 transition-all duration-300
                ${currentSlide === index
                  ? 'border-blue-900 bg-blue-900/80 shadow-lg shadow-blue-900/40 scale-110'
                  : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20'
                }
                backdrop-blur-sm relative`
              }
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className={`text-base font-medium ${currentSlide === index ? 'text-yellow-400' : 'text-white'}`}>{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Slide Area */}
      <div className="flex-1 flex flex-col h-full relative py-8 pr-8 pl-4 items-center justify-center" style={{ paddingTop: 80, paddingLeft: 96 }}>
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-full max-w-7xl h-full flex flex-col pt-16">
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="flex items-center justify-center w-full h-full">
              <div
                id={`slide-${currentSlide}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '794px',
                  height: '1123px',
                  aspectRatio: '210/297',
                }}
              >
                <Card className="w-full h-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 flex items-stretch bg-transparent border-0">
                  {renderSlideContent(processedSlides[currentSlide])}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export container for PDF */}
      <div style={{ position: 'absolute', left: '-99999px', top: 0 }} id="all-slides-export-container">
        {processedSlides.map((slide, idx) => (
          <div key={idx} className="slide-content-export" style={{ width: '794px', height: '1123px' }}>
            {renderSlideContent(slide)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SOWViewer;
