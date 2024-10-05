import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card } from "../components/ui/card"
import { Moon, Sun, Download, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion';

interface DownloadResult {
  info: {
    title: string;
    thumbnail: string;
    image: string;
    url: string;
    type: string;
    format: string;
  };
  download_url: string;
  id: string;
}

interface ProgressResult {
  progress: number;
  success: number;
  download_url: string;
}

const supportedPlatforms = [
  { name: 'YouTube', icon: 'https://www.svgrepo.com/show/28730/youtube.svg?height=24&width=24' },
  { name: 'Facebook', icon: 'https://www.svgrepo.com/show/169503/facebook.svg?height=24&width=24' },
  { name: 'Instagram', icon: 'https://www.svgrepo.com/show/452229/instagram-1.svg?height=24&width=24' },
  { name: 'TikTok', icon: 'https://img.icons8.com/?size=100&id=118640&format=png&color=000000?height=24&width=24' },
  { name: 'Twitter', icon: 'https://img.icons8.com/?size=100&id=5MQ0gPAYYx7a&format=png&color=000000?height=24&width=24' },
  { name: 'Vimeo', icon: 'https://www.svgrepo.com/show/25164/vimeo.svg?height=24&width=24' },
  { name: 'SoundCloud', icon: 'https://img.icons8.com/?size=100&id=13669&format=png&color=000000?height=24&width=24' },
  { name: 'Twitch', icon: 'https://img.icons8.com/?size=100&id=7qFfaszJSlTs&format=png&color=000000?height=24&width=24' },
];

const audioFormats = ['mp3', 'm4a', 'webm', 'aac', 'flac', 'opus', 'ogg', 'wav'];
const videoFormats = ['360', '480', '720', '1080', '1440', '4k'];

const features = [
  { counter: 1, name: "No Download Limit", desc: "You can download all the content you want without limits." },
  { counter: 2, name: "Downloads At No Cost", desc: "You can convert Video and Audio content and download it for free here." },
  { counter: 3, name: "The Best Speeds", desc: "Our platform converts Audio and Video in seconds." },
  { counter: 4, name: "Easy to Use", desc: "You can convert and download content using our tool with a few clicks." },
  { counter: 5, name: "No Need For Apps", desc: "Since our tool is online, you can use it without having to install anything on your device." },
  { counter: 6, name: "Well Secured", desc: "Our website is very well secured. We have developed this website with user security in mind. So there will be no problem with security" },
];

export default function PlatformDownloader() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('720');
  const [showFormatSelector, setShowFormatSelector] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [downloadResult, setDownloadResult] = useState<DownloadResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode: boolean) => !prevMode);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setDisplayProgress(0);
    try {
      const response = await fetch(`https://ab.cococococ.com/ajax/download.php?copyright=0&format=${format}&url=${url}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`);
      const data: DownloadResult = await response.json();
      setDownloadResult(data);
      setIsLoading(false);
      
      // Start progress polling
      pollProgress(data.id);
    } catch (error) {
      console.error('Error fetching download data:', error);
      setIsLoading(false);
    }
  };

  const pollProgress = async (id: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`https://p.oceansaver.in/ajax/progress.php?id=${id}`);
        const data: ProgressResult = await response.json();
        
        // Update display progress
        setDisplayProgress(Math.min(Math.floor(data.progress / 10), 100));
        
        if (data.success === 1 || data.progress >= 1000) {
          clearInterval(pollInterval);
          setDisplayProgress(100);
          setDownloadResult(prevResult => prevResult ? {...prevResult, download_url: data.download_url} : null);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        clearInterval(pollInterval);
      }
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailData = {
      from: email,
      to: 'deepakpuri9190@gmail.com',
      subject: subject,
      text: message,
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Media Downloader</span>
              </div>
            </div>
            <div className="flex items-center">
              <Button onClick={toggleDarkMode} variant="ghost" size="icon" className="mr-2">
                {darkMode ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-gray-900" color='white' />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Download Media</h2>
          <div className="flex flex-col space-y-4">
            <div className="download-box">
              <div className="wrapper">
                <Input
                  type="text"
                  className="input-url link text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  placeholder="Paste Your URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="button-group flex space-x-2 mt-2">
                  <div className="relative">
                    <Button
                      onClick={() => setShowFormatSelector(!showFormatSelector)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {format} <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    {showFormatSelector && (
                      <div className="absolute z-10 w-64 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg text-white">
                        <div className="grid grid-cols-2 gap-4 p-4">
                          <div>
                            <h3 className="font-semibold mb-2">Audio</h3>
                            {audioFormats.map((f) => (
                              <button
                                key={f}
                                className="block w-full text-left py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                onClick={() => {
                                  setFormat(f);
                                  setShowFormatSelector(false);
                                }}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Video</h3>
                            {videoFormats.map((f) => (
                              <button
                                key={f}
                                className="block w-full text-left py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                onClick={() => {
                                  setFormat(f);
                                  setShowFormatSelector(false);
                                }}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Supported Platforms</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {supportedPlatforms.map((platform) => (
              <div key={platform.name} className="flex items-center space-x-2">
                <img src={platform.icon} alt={platform.name} className="w-6 h-6" />
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {isLoading ? (
          <Card className="p-6 mb-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          </Card>
        ) : downloadResult ? (
          <Card className="p-6 mb-6">
            <div className="result-container">
              <div className="result-content flex flex-col md:flex-row">
                <div className="video-thumb w-full md:w-1/3 mb-4 md:mb-0">
                  <img src={downloadResult.info.image} alt="" className="w-full h-auto rounded-2xl" />
                </div>
                <div className="video-details w-full md:w-2/3 md:pl-4">
                  <div className="tag-list flex space-x-2 mb-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded">{format}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="video-title text-xl font-bold">{downloadResult.info.title}</div>
                    <p className="video-url break-words"><span className="font-bold">URL:</span> {url}</p>
                  </div>
                  <a href={downloadResult.download_url} target='__blank' className="btn-download block mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded relative overflow-hidden cursor-pointer">
                    <div className="progress absolute top-0 left-0 h-full bg-purple-800" style={{ width: `${displayProgress}%` }}></div>
                    <span className="flex items-center justify-center relative z-10">
                      <svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M8 21.0002H16C18.8284 21.0002 20.2426 21.0002 21.1213 20.1215C22 19.2429 22 17.8286 22 15.0002V14.0002C22 11.1718 22 9.7576 21.1213 8.8789C20.3529 8.11051 19.175 8.01406 17 8.00195M7 8.00195C4.82497 8.01406 3.64706 8.11051 2.87868 8.87889C2 9.7576 2 11.1718 2 14.0002V15.0002C2 17.8286 2 19.2429 2.87868 20.1215C3.17848 20.4213 3.54062 20.6188 4 20.749" stroke="#F5F6FA" strokeWidth="2" strokeLinecap="round"></path>
                        <path d="M12 1V14M12 14L9 10.5M12 14L15 10.5" stroke="#F5F6FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                      Download to Your Device ({displayProgress}%)
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div className="max-w-[496px] mx-auto font-medium text-[15px] lg:text-[21px] text-center text-light-black-600 pt-10">
              Thanks for downloading your video. You can now convert your video for free online <a className="text-purple-500 hover:underline" href="https://convertr.org">here</a>
            </div>
          </Card>
        ) : null}

        <Card className="p-6 mb-6">
          <div className="container mb-6">
            <div className="section-body" id="text-wrapper">
              <h2 className="text-2xl font-bold mb-4">About Our Service</h2>
              <p className="mb-4">With dkdownloder.com, you can download and convert videos from countless online sources like YouTube, Twitter, Facebook, OK.ru, TikTok, and more. Its simple functionality requires you to paste the video URL, select your desired format, and click download.</p>
              <p className="mb-4">This user-friendly tool provides a straightforward way to acquire videos from the web.</p>
              <h3 className="text-xl font-semibold mb-2">From Screen to Speaker: YouTube to MP3 320 KBPS in High Definition</h3>
              <p className="mb-4">The YouTube to MP3 320kbps downloader takes your favorite YouTube videos and turns them into amazing MP3s at 320kbps. The process is immensely safe and occurs in a flash.</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 overflow-hidden">
          <h2 className="text-2xl font-bold mb-4 text-center">What Makes Us Special</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-item relative p-6 bg-gray-800 rounded-lg overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  backgroundImage: `url("data:image/svg+xml,<svg width='222' height='247' viewBox='0 0 222 247' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='171' cy='171' r='170.25' stroke='white' stroke-opacity='.12' stroke-width='1.5'/><circle cx='195' cy='210' r='146.25' stroke='white' stroke-opacity='.12' stroke-width='1.5'/><circle cx='195' cy='230' r='97.25' stroke='white' stroke-opacity='.12' stroke-width='1.5'/></svg>")`,
                  backgroundColor: 'rgb(108 92 231)',
                }}
                initial={{ backgroundImage: 'none' }}
              >
                <div className="feature-counter bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mb-2">
                  {feature.counter}
                </div>
                <div className="feature-name text-lg font-semibold mb-2 text-white">{feature.name}</div>
                <div className="feature-desc text-gray-300">{feature.desc}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="mb-4">Contact Us using this form!</p>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter Your Email ..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 text-white"
            />
            <Input
              type="text"
              placeholder="Enter Your Subject ..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-gray-700 text-white"
            />
            <Textarea
              placeholder="Enter Your Message ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full bg-gray-700 text-white"
              rows={6}
            />
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Send Message
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}