'use client'

import { WebGLText, WebGLTextPostProcessing } from '@/components/WebGLText'
import { View } from '@/providers/shared-canvas-provider'
import './demo.scss'

export default function WebGLTextDemo() {
  return (
    <div className="webgl-text-demo">
      {/* Enable post-processing for the entire scene */}
      <View className="webgl-text-demo__canvas">
        <WebGLTextPostProcessing enabled={true} />
      </View>

      <div className="webgl-text-demo__content">
        <section className="webgl-text-demo__hero">
          <WebGLText
            as="h3"
            className="webgl-text-demo__subtitle"
            fontWeight={500}
            fontSize={20}
            textAlign="center"
            shader="gradient"
            gradientColors={['#00ff88', '#ff0066']}
          >
            THREE.JS
          </WebGLText>
          
          <WebGLText
            as="h1"
            className="webgl-text-demo__title"
            fontWeight={700}
            fontSize={80}
            textAlign="center"
            shader="mask-reveal"
            maskReveal={true}
            animationDelay={0.2}
          >
            RESPONSIVE AND ACCESSIBLE TEXT
          </WebGLText>
        </section>

        <section className="webgl-text-demo__main">
          <WebGLText
            as="p"
            className="webgl-text-demo__paragraph"
            fontWeight={400}
            fontSize={24}
            textAlign="left"
            shader="distort"
            distortionAmount={0.05}
            distortionSpeed={0.5}
            animationDelay={0.4}
          >
            THIS TEXT IS STYLED TO LOOK LIKE A TYPICAL BLOCK OF TEXT ON A STANDARD
            WEBSITE. BUT UNDER THE SURFACE, IT&apos;S BEING RENDERED WITH WEBGL INSTEAD
            OF TRADITIONAL HTML.
          </WebGLText>

          <WebGLText
            as="p"
            className="webgl-text-demo__paragraph"
            fontWeight={400}
            fontSize={24}
            textAlign="left"
            shader="default"
            color="#fdcdf9"
            animationDelay={0.6}
          >
            THIS OPENS THE DOOR TO CUSTOM SHADER EFFECTS AND INTERACTIONS THAT GO
            BEYOND WHAT&apos;S POSSIBLE WITH TRADITIONAL HTML.
          </WebGLText>

          <WebGLText
            as="p"
            className="webgl-text-demo__paragraph"
            fontWeight={400}
            fontSize={24}
            textAlign="left"
            shader="gradient"
            gradientColors={['#ff0066', '#00ff88']}
            animationDelay={0.8}
          >
            WE KEEP THE UNDERLYING HTML STRUCTURE PRESENT IN THE DOM. RATHER THAN
            CREATING MESHES DIRECTLY IN THREE.JS, THE SCENE IS BUILT BY READING FROM
            THE EXISTING HTML CONTENT. THIS WAY, SCREEN READERS, SEARCH ENGINES, AND
            OTHER TOOLS CAN STILL INTERPRET THE PAGE AS EXPECTED.
          </WebGLText>
        </section>

        <section className="webgl-text-demo__footer">
          <WebGLText
            as="p"
            className="webgl-text-demo__cta"
            fontWeight={800}
            fontSize={60}
            textAlign="center"
            shader="mask-reveal"
            maskReveal={true}
            animationDelay={1.0}
          >
            NOW GO CRAZY WITH THE SHADERS :)
          </WebGLText>
        </section>
      </div>
    </div>
  )
}