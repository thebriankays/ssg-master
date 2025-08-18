import { AnimatedBox } from '@/components/animated-box'
import { Image as WebGLImage } from '@/webgl/components/image'
import { View } from '@/webgl/components/view'

export default function WebGLDemoPage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">WebGL Integration Demo</h1>
      
      {/* Example 1: Animated Box with WebGL */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Interactive 3D Box</h2>
        <p className="mb-4">Hover over the box to see the WebGL interaction</p>
        <AnimatedBox className="mb-8" />
      </section>

      {/* Example 2: WebGL Image */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">WebGL Enhanced Image</h2>
        <div className="grid grid-cols-2 gap-8">
          <WebGLImage
            src="/api/media/file/hero1a-jpg.jpg"
            alt="Demo image"
            width={600}
            height={400}
            className="rounded-lg overflow-hidden"
          />
          <WebGLImage
            src="/api/media/file/hero1a-jpg.jpg"
            alt="Demo image 2"
            width={600}
            height={400}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </section>

      {/* Example 3: View System */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">View System with WebGL</h2>
        <div className="grid grid-cols-3 gap-4">
          <View className="bg-gray-100 p-4 rounded">
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshNormalMaterial />
            </mesh>
          </View>
          <View className="bg-gray-100 p-4 rounded">
            <mesh>
              <torusGeometry args={[1, 0.4, 16, 32]} />
              <meshNormalMaterial />
            </mesh>
          </View>
          <View className="bg-gray-100 p-4 rounded">
            <mesh>
              <coneGeometry args={[1, 2, 32]} />
              <meshNormalMaterial />
            </mesh>
          </View>
        </div>
      </section>
    </div>
  )
}