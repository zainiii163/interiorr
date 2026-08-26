import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import ScrollReveal from '../ui/ScrollReveal';
import { apiFetch } from '../../services/api';

export default function VideoShowcase() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await apiFetch('/media?type=video&placement=home');
        if (res.success && res.data.length > 0) {
          setVideos(res.data);
        }
      } catch (e) {
        console.error('Error fetching videos:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return null;
  }

  if (videos.length === 0) {
    return null;
  }

  const getVideoEmbedUrl = (url) => {
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop() 
        : new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    
    // Direct video URLs
    return url;
  };

  const isYouTube = (url) => url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = (url) => url.includes('vimeo.com');

  return (
    <>
      <section className="py-24 bg-gradient-to-b from-[#1A1817] to-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-[#C4795A] font-semibold text-xs uppercase tracking-widest">
                Our Work in Motion
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-stone-100 mt-2">
                Project Video Showcase
              </h2>
              <p className="text-stone-400 mt-4 max-w-2xl mx-auto">
                Watch our transformation projects come to life. From concept to completion, 
                see the craftsmanship and attention to detail that goes into every interior.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {videos.map((video, index) => (
              <ScrollReveal key={video._id} delay={index * 100}>
                <div
                  onClick={() => setSelectedVideo(video)}
                  className="group relative aspect-video bg-stone-800 rounded-2xl overflow-hidden cursor-pointer hover-lift"
                >
                  {/* Thumbnail or fallback */}
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title || 'Video thumbnail'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-[#C4795A] mx-auto mb-2" />
                        <p className="text-stone-400 text-sm">{video.title || 'Video'}</p>
                      </div>
                    </div>
                  )}

                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#C4795A] rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>

                  {/* Title overlay */}
                  {video.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-semibold text-sm line-clamp-2">{video.title}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="modal-overlay bg-black/90 items-center p-3 sm:p-4">
          <div className="relative w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 sm:-top-12 sm:right-0 text-white hover:text-[#C4795A] transition-colors z-10 p-2 rounded-full bg-stone-900/80 sm:bg-transparent"
              aria-label="Close video"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden">
              {isYouTube(selectedVideo.url) || isVimeo(selectedVideo.url) ? (
                <iframe
                  src={getVideoEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.title || 'Video'}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedVideo.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                  title={selectedVideo.title || 'Video'}
                />
              )}
            </div>

            {selectedVideo.title && (
              <div className="mt-4 text-center">
                <h3 className="text-white font-serif text-xl font-bold">{selectedVideo.title}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
